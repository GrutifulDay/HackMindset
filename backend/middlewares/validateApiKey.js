import { UAParser } from "ua-parser-js"
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js"
import { TOKEN_IP_CITY, CHROME_EXTENSION_ALL_URL } from "../config.js"

// 🌍 Získání města z IP
const getCityByIP = async (ip) => {
  const realIP =
    ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1"
      ? "8.8.8.8" // testovací fallback pro localhost
      : ip

  const token = TOKEN_IP_CITY

  try {
    const response = await fetch(`https://ipinfo.io/${realIP}/json?token=${token}`)
    const data = await response.json()
    console.log("🔍 Data z ipinfo.io:", data)
    return data.city || "Neznámé město"
  } catch (err) {
    console.error("❌ Chyba při získávání města:", err.message);
    return "Neznámé město"
  }
}

export function validateApiKey(expectedKey, routeDescription) {
  console.log("validateApiKey funguje")

  return async function (req, res, next) {
    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "neznámá IP"

    const userAgentString = req.get("User-Agent") || "Neznámý"
    const origin = req.headers.origin || ""
    const referer = req.headers.referer || ""
    const extensionHeader = req.headers["x-extension-auth"] || ""

    const extensionID = CHROME_EXTENSION_ALL_URL

    // kontrola IP hned na zacatku (rychlejsi)
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Vaše IP je na blacklistu." });
    }

    // vyjimka: rozsireni – origin nebo referer obsahuje ID - pridano kvuli API key
    if (
      origin.includes(extensionID) ||
      referer.includes(extensionID) ||
      extensionHeader === "HECK_EXTENSION"
    ) {
      console.log("✅ Povolen přístup z rozšíření");
      return next();
    }

    // platny API klic
    const apiKey = req.headers["x-api-key"]
    if (apiKey === expectedKey) {
      console.log("✅ Povolen přístup pomocí API klíče");
      return next()
    }

    // mesto 
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()
    const city = await getCityByIP(userIP)

    // pridani na blacklist
    await addToBlacklist(userIP, routeDescription, {
      userAgent: userAgentString,
      browser: result.browser?.name || "Neznámý",
      os: result.os?.name || "Neznámý",
      deviceType: result.device?.type || "Neznámý",
      city: city || "Neznámý",
    })

    return res
        .status(403)
        .json({ error: "Neplatný API klíč nebo neautorizovaný zdroj" }) 
    }
}
