import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { CHROME_EXTENSION_ALL_URL, JWT_SECRET } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";  // <- doplnit
import { redactHeaders } from "../utils/redact.js";
import { isRevoked } from "../middlewares/tokenRevocation.js"
import { registerTokenUsage } from "../middlewares/tokenUsage.js";
import chalk from "chalk";

// citlivé hlavičky maskujeme
// const redact = (obj = {}) => {
//   const SENSITIVE = new Set(["authorization","cookie","proxy-authorization","x-api-key","set-cookie"]);
//   const out = {};
//   for (const [k,v] of Object.entries(obj)) {
//     out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
//   }
//   return out;
// };

export function validateApiKey(routeDescription) {
  console.log("validateApiKey funguje");

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

      // Vyjimka pokud ma request platny JWT z extension → povoli dal, i kdyz je IP blokovana 
      if (req.tokenPayload?.sub === "chrome-extension") {
        console.log("🧩 validateApiKey: požadavek z rozšíření s platným JWT → povoleno (přeskakuji IP blacklist)");
        return next();
      }
  
      // kontrola IP blacklistu
      if (await isBlacklisted(userIP)) {
        return res.status(403).json({ error: "Vaše IP je na blacklistu." });
      }


    console.log("📦 PŘÍCHOZÍ HLAVIČKY:");
    Object.entries(req.headers).forEach(([key, value]) => {
      console.log(`→ ${key}: ${value}`);
    });

    // kontrola zdroje pozadavku
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

      // kontrola audience pro vydani tokenu jen pro muj server v rozsireni 
    if (decodedToken.aud !== "https://localhost:3000/api") {
      console.warn("❌ Token má špatnou audience:");
      console.warn(chalk.red.bold("→ expected:", expectedAudience));
      console.warn(chalk.red.bold("→ received:", decodedToken.aud));
      return await blockRequest(
        req,
        res,
        userIP,
        userAgentString,
        routeDescription,
        "Invalid audience"
    );
  }

  // pokud vrati true, token byl revokovan
const abuseDetected = registerTokenUsage({
  jti: decodedToken.jti,
  ip: userIP,
  userAgent: userAgentString,
  path: req.originalUrl
});

if (abuseDetected) {
  // token revokovan -> blokace ip adresy
  return await blockRequest(req, res, userIP, userAgentString, routeDescription, "Token abuse detected and revoked");
}
  console.log(chalk.magenta.bold("✅ JWT audience je platná:", decodedToken.aud));

  if (isRevoked(decodedToken.jti)) {
    console.warn("🚫 Token byl revokován:", decodedToken.jti);
    return await blockRequest(
      req,
      res,
      userIP,
      userAgentString,
      routeDescription,
      "Revoked JWT"
    );
  }
  
  console.log("✅ JWT není revokován:", decodedToken.jti);

    } catch (err) {
      console.warn("❌ Neplatný JWT token:", err.message);
      return await blockRequest(req, res, userIP, userAgentString, routeDescription, "Invalid JWT token");
    }

    // povoleni jen pokud sedi i extension ID
    const isFromExtension = isFromAllowedSource && decodedToken.extId === CHROME_EXTENSION_ALL_URL;

    if (isFromExtension) {
      console.log("✅ Povolen přístup z rozšíření (JWT validní)");
      req.tokenPayload = decodedToken;
      return next();
    }

    // pokud nesedi – blokuje
    console.warn("⛔️ Token validní, ale zdroj neodpovídá.");
    return await blockRequest(req, res, userIP, userAgentString, routeDescription, "Valid JWT, bad origin/referer");
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
