import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { CHROME_EXTENSION_ALL_URL, JWT_SECRET } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";  
import { redactHeaders } from "../utils/redact.js";
import { isRevoked } from "../middlewares/tokenRevocation.js";
import { registerTokenUsage } from "../middlewares/tokenUsage.js";
import { debug, warn } from "../utils/logger.js";
import { DEBUG, NODE_ENV, API_BASE_URL } from "../config.js";

export function validateApiKey(routeDescription) {
  debug("validateApiKey funguje");

  return async function (req, res, next) {
    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "neznámá IP";

    const userAgentString = req.get("User-Agent") || "Neznámý";
    const origin = req.headers.origin || "";
    const referer = req.headers.referer || "";
    const extensionID = CHROME_EXTENSION_ALL_URL;
    const rawAuthHeader = req.headers.authorization || "";
    const tokenFromHeader = rawAuthHeader.startsWith("Bearer ")
      ? rawAuthHeader.split(" ")[1]
      : "";

    // ⭐⭐⭐ FIX: rozpoznání Chrome extension ještě před blacklistem ⭐⭐⭐
    const isExtensionSignature = rawAuthHeader === "Bearer EXTENSION_SIGNATURE";

    const looksLikeExtension =
      origin.includes(extensionID) ||
      referer.includes(extensionID) ||
      isExtensionSignature;

    if (looksLikeExtension) {
      debug("🧩 Chrome extension detected → skipping blacklist");
      return next();
    }

    // kontrola IP blacklistu
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Access blocked" });
    }

    if (DEBUG && NODE_ENV !== "production") {
      debug("📦 PŘÍCHOZÍ HLAVIČKY:");
      Object.entries(req.headers).forEach(([key, value]) => {
        debug(`→ ${key}: ${value}`);
      });
    }

    // kontrola zdroje požadavku
    const isLikelyFromChrome =
      userAgentString.includes("Chrome") && !userAgentString.includes("Postman");

    const isFromAllowedSource =
      origin.includes(extensionID) ||
      referer.includes(extensionID) ||
      isLikelyFromChrome;

    // overeni JWT tokenu
    let decodedToken;
    try {
      decodedToken = jwt.verify(tokenFromHeader, JWT_SECRET);

      if (decodedToken.aud !== API_BASE_URL) {
        warn("❌ Token má špatnou audience:");
        warn("→ received:", decodedToken.aud);
        return await blockRequest(
          req,
          res,
          userIP,
          userAgentString,
          routeDescription,
          "Invalid audience"
        );
      }

      // token abuse detection
      const abuseDetected = registerTokenUsage({
        jti: decodedToken.jti,
        ip: userIP,
        userAgent: userAgentString,
        path: req.originalUrl
      });

      if (abuseDetected) {
        return await blockRequest(
          req,
          res,
          userIP,
          userAgentString,
          routeDescription,
          "Token abuse detected and revoked"
        );
      }

      if (isRevoked(decodedToken.jti)) {
        warn("🚫 Token byl revokován:", decodedToken.jti);
        return await blockRequest(
          req,
          res,
          userIP,
          userAgentString,
          routeDescription,
          "Revoked JWT"
        );
      }

      debug("✅ JWT není revokován:", decodedToken.jti);

    } catch (err) {
      warn("❌ Neplatný JWT token:", err.message);
      return await blockRequest(
        req,
        res,
        userIP,
        userAgentString,
        routeDescription,
        "Invalid JWT token"
      );
    }

    // povoleni jen pokud sedí extension ID
    const isFromExtension =
      isFromAllowedSource && decodedToken.extId === CHROME_EXTENSION_ALL_URL;

    if (isFromExtension) {
      debug("✅ Povolen přístup z rozšíření (JWT validní)");
      req.tokenPayload = decodedToken;
      return next();
    }

    warn("⛔️ Token validní, ale zdroj neodpovídá.");
    return await blockRequest(
      req,
      res,
      userIP,
      userAgentString,
      routeDescription,
      "Valid JWT, bad origin/referer"
    );
  };
}

async function blockRequest(req, res, userIP, userAgentString, routeDescription, reason = "Access denied") {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();
  const city = await getCityByIP(userIP);

  await addToBlacklist(userIP, routeDescription, {
    userAgent: userAgentString,
    browser: result.browser?.name || "Neznámý",
    os: result.os?.name || "Neznámý",
    deviceType: result.device?.type || "Neznámý",
    city: city || "Neznámý",
    method: req.method,
    path: req.originalUrl
  });

  await notifyBlockedIP({
    ip: userIP,
    city: city || "Neznámé",
    userAgent: userAgentString,
    reason,
    method: req.method,
    path: req.originalUrl,
    headers: redactHeaders(req.headers),
  });

  return res.status(403).json({ error: "Access denied" });
}
