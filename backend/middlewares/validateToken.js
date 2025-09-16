import { isBlacklisted } from "./ipBlacklist.js"
import { CHROME_EXTENSION_ALL_URL, HACK_MINDSET } from "../config.js"

// 🔐 Middleware pro validaci přístupu
export function validateToken(expectedKey, routeDescription) {
  console.log("validateApiKey funguje")

  return async function (req, res, next) {
    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "neznámá IP"

    const userAgentString = req.get("User-Agent") || "Neznámý"
    const origin = req.headers.origin || ""
    const referer = req.headers.referer || ""
    const extensionID = CHROME_EXTENSION_ALL_URL
    const rawAuthHeader = req.headers.authorization || ""
    const extensionHeader = rawAuthHeader.startsWith("Bearer ")
        ? rawAuthHeader.split(" ")[1]
        : ""

    // preklad aliasu na skutecny klic 
    const realExtensionHeader =
      extensionHeader === "HACK_MINDSET"
        ? HACK_MINDSET
        : extensionHeader

    // kontrola IP z blacklist
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Vaše IP je na blacklistu." })
    }

    console.log("📦 PŘÍCHOZÍ HLAVIČKY:");

    Object.entries(req.headers).forEach(([key, value]) => {
      console.log(`→ ${key}: ${value}`);
    });


    // pristup povoleny jen z google rozsireni
    // pokud alias - tak je z roszireni 
    // pokud někdo pošle HACK_MINDSET jako alias, musi mít spravny origin nebo referer
    const isAlias = extensionHeader === "HACK_MINDSET"
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
      console.log("🧪 Příchozí Authorization:", req.headers["Authorization"]);
      console.log("🧪 Očekávaný klíč (expectedKey):", expectedKey);

      console.log("📩 Headers přijaté od klienta:");
      console.log("→ origin:", req.headers.origin || "žádný origin");
      console.log("→ referer:", req.headers.referer || "žádný referer");
      console.log("→ Authorization:", req.headers["Authorization"] || "žádný");
      console.log("→ user-agent:", req.headers["user-agent"] || "žádný");
      console.log("🔍 isAlias:", isAlias);
      console.log("🔍 isFromAllowedSource:", isFromAllowedSource);
      console.log("🔍 isLikelyFromChrome:", isLikelyFromChrome);

      return next()
    }

    return res
      .status(403)
      .json({ error: "Access denied" })
  }
}