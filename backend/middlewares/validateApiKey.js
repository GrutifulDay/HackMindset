import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { CHROME_EXTENSION_ALL_URL, JWT_SECRET } from "../config.js";

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

    // ⚠️ Kontrola IP blacklistu
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Vaše IP je na blacklistu." });
    }

    console.log("📦 PŘÍCHOZÍ HLAVIČKY:");
    Object.entries(req.headers).forEach(([key, value]) => {
      console.log(`→ ${key}: ${value}`);
    });

    // 🔎 Kontrola zdroje pozadavku
    const isLikelyFromChrome =
      userAgentString.includes("Chrome") && !userAgentString.includes("Postman");

    const isFromAllowedSource =
      origin.includes(extensionID) ||
      referer.includes(extensionID) ||
      isLikelyFromChrome;

    // 🔐 overeni JWT tokenu (nahrazuje alias HACK_EXTENSION)
    let decodedToken;
    try {
      decodedToken = jwt.verify(tokenFromHeader, JWT_SECRET);
    } catch (err) {
      console.warn("❌ Neplatný JWT token:", err.message);
      return await blockRequest(req, res, userIP, userAgentString, routeDescription);
    }

    // 🔑 podminky, kdy pusti dal
    const isFromExtension = isFromAllowedSource && decodedToken.extId === CHROME_EXTENSION_ALL_URL;

    if (isFromExtension) {
      console.log("✅ Povolen přístup z rozšíření (JWT validní)");

      console.log("🔐 JWT payload:", decodedToken);
      console.log("→ origin:", origin || "žádný");
      console.log("→ referer:", referer || "žádný");
      console.log("→ user-agent:", userAgentString);

      req.tokenPayload = decodedToken;
      return next();
    }

    // pokud nesedi – blokuje
    console.warn("⛔️ Token validní, ale zdroj neodpovídá.");
    return await blockRequest(req, res, userIP, userAgentString, routeDescription);
  };
}

async function blockRequest(req, res, userIP, userAgentString, routeDescription) {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();
  const city = await getCityByIP(userIP);

  await addToBlacklist(userIP, routeDescription, {
    userAgent: userAgentString,
    browser: result.browser?.name || "Neznámý",
    os: result.os?.name || "Neznámý",
    deviceType: result.device?.type || "Neznámý",
    city: city || "Neznámý",
  });

  return res
    .status(403)
    .json({ error: "Neautorizovaný přístup nebo neplatný token." });
}
