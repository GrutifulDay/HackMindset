import { UAParser } from "ua-parser-js"
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js"
import { TOKEN_IP_CITY, CHROME_EXTENSION_ALL_URL, HACK_EXTENSION } from "../config.js"

// 🌍 Získání města z IP
const getCityByIP = async (ip) => {
  const realIP =
    ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1"
      ? "8.8.8.8" // testovaci pro localhost
      : ip

  const token = TOKEN_IP_CITY

  try {
    const response = await fetch(`https://ipinfo.io/${realIP}/json?token=${token}`)
    const data = await response.json()
    console.log("🔍 Data z ipinfo.io:", data)
    return data.city || "Neznámé město"
  } catch (err) {
    console.error("❌ Chyba při získávání města:", err.message)
    return "Neznámé město"
  }
}

// 🔐 Middleware pro validaci přístupu
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

    // preklad aliasu na skutecny klic 
    const realExtensionHeader =
      extensionHeader === "HECK_EXTENSION"
        ? HACK_EXTENSION
        : extensionHeader

    // kontrola IP z blacklist
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Vaše IP je na blacklistu." })
    }

    console.log("📦 PŘÍCHOZÍ HLAVIČKY:");

    Object.entries(req.headers).forEach(([key, value]) => {
      console.log(`→ ${key}: ${value}`);
    });


    // pristup pomovoleny jen z google rozsireni
    // pokud alias - tak je z roszireni 
    // pokud někdo pošle HECK_EXTENSION jako alias, musi mít spravny origin nebo referer
    const isAlias = extensionHeader === "HACK_EXTENSION"
    const isLikelyFromChrome =
    userAgentString.includes("Chrome") && !userAgentString.includes("Postman")

    // z povoleneho zdroje
    const isFromAllowedSource =
      origin.includes(extensionID) ||
      referer.includes(extensionID) ||
      isLikelyFromChrome

    // 
    const isFromExtension =
      (isAlias && isFromAllowedSource) ||               // alias + spravny zdroj
      (!isAlias && realExtensionHeader === expectedKey) // pripadny test klic 

    if (isFromExtension) {
      console.log("✅ Povolen přístup z rozšíření");
      
      console.log("CHROME_EXTENSION_ALL_URL:", CHROME_EXTENSION_ALL_URL);
      console.log("🧪 Příchozí x-extension-auth:", req.headers["x-extension-auth"]);
      console.log("🧪 Očekávaný klíč (expectedKey):", expectedKey);

      console.log("📩 Headers přijaté od klienta:");
      console.log("→ origin:", req.headers.origin || "žádný origin");
      console.log("→ referer:", req.headers.referer || "žádný referer");
      console.log("→ x-extension-auth:", req.headers["x-extension-auth"] || "žádný");
      console.log("→ user-agent:", req.headers["user-agent"] || "žádný");
      console.log("🔍 isAlias:", isAlias);
      console.log("🔍 isFromAllowedSource:", isFromAllowedSource);
      console.log("🔍 isLikelyFromChrome:", isLikelyFromChrome);



      return next()
    }

    // mesto + neautorizovany klic
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
      .json({ error: "Neplatny API klic nebo neautorizovany zdroj" })
  }
}
