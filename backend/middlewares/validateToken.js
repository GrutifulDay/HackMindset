import { isBlacklisted } from "./ipBlacklist.js"
import { HACK_MINDSET, CHROME_EXTENSION_ALL_URL } from "../config.js";
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

    // 🔁 Pokud prisel alias "HACK_MINDSET", prelozi na tajne heslo z env
    const resolvedKey =
      authValue === "HACK_MINDSET" ? HACK_MINDSET : authValue

    // overeni proti ocekavanemu klici (z .env)
    const isValid = resolvedKey === HACK_MINDSET

    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "IP je na blacklistu." })
    }

    if (isValid) {
      debug("✅ Přístup povolen")
      debug("→ resolvedKey:", resolvedKey)
      debug("→ expectedKey:", HACK_MINDSET)
      return next()
    }

    warn("🚫 Zamítnuto – neplatný klíč")
    debug("→ authValue:", authValue)
    debug("→ expectedKey:", HACK_MINDSET)
    return res.status(403).json({ error: "Access denied" })
  }
}


