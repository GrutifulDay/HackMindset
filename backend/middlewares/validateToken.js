import { isBlacklisted } from "./ipBlacklist.js"
import { EXTENSION_SIGNATURE, CHROME_EXTENSION_ALL_URL } from "../config.js";
import { debug, warn } from "../utils/logger.js";


export function validateToken() {
    return async function (req, res, next) {
      // get-token
      const origin = req.headers.origin || "";
      const referer = req.headers.referer || "";
      const ua = req.get("User-Agent") || "";
  
      const isFromExtensionOrigin = origin.includes(CHROME_EXTENSION_ALL_URL) || referer.includes(CHROME_EXTENSION_ALL_URL);
      const isChromeUA = ua.includes("Chrome");
  
      const isGetTokenRoute = req.path === "/api/get-token" || req.originalUrl?.startsWith("/api/get-token");
  
      if (isGetTokenRoute && (isFromExtensionOrigin || isChromeUA)) {
        // povolit request pro vydani tokenu (getToken overi origin & UA)
        return next();
      }

    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "neznámá IP"

    const rawAuthHeader = req.headers.authorization || ""
    const authValue = rawAuthHeader.startsWith("Bearer ")
      ? rawAuthHeader.split(" ")[1]
      : ""

    // 🔁 Pokud prisel alias "EXTENSION_SIGNATURE", prelozi na tajne heslo z env
    const resolvedKey =
      authValue === "EXTENSION_SIGNATURE" ? EXTENSION_SIGNATURE : authValue

    // overeni proti ocekavanemu klici (z .env)
    const isValid = resolvedKey === EXTENSION_SIGNATURE

    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Access blocked" })
    }

    if (isValid) {
      debug("✅ Přístup povolen")
      debug("→ resolvedKey:", resolvedKey)
      debug("→ expectedKey:", EXTENSION_SIGNATURE)
      return next()
    }

    warn("🚫 Zamítnuto – neplatný klíč")
    debug("→ authValue:", authValue)
    debug("→ expectedKey:", EXTENSION_SIGNATURE)
    return res.status(403).json({ error: "Access denied" })
  }
}


