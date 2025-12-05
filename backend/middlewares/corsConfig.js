// middlewares/botProtection.js
import { addToBlacklist } from "./ipBlacklist.js";
import { redactHeaders } from "../utils/redact.js";
import { warn } from "../utils/logger.js";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";

// IP extrakce
function getUserIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown-ip"
  );
}

export default function botProtection(req, res, next) {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const ua = req.get("User-Agent") || "";
  const ip = getUserIP(req);

  // 1) Chrome extension má absolutní prioritu
  // ---------------------------------------------------
  if (
    (origin && origin.startsWith(CHROME_EXTENSION_ALL_URL)) ||
    (referer && referer.startsWith(CHROME_EXTENSION_ALL_URL))
  ) {
    return next(); // 🔥 nikdy neblokovat extension
  }

  // 2) OPTIONS (preflight) → necháme projít
  // ---------------------------------------------------
  if (req.method === "OPTIONS") {
    return next();
  }

  // 3) Pokud není User-Agent → to je vždy bot / scanner
  // ---------------------------------------------------
  if (!ua) {
    warn(`🚨 Bot detected (missing UA) – IP ${ip}`);

    addToBlacklist(ip, "Missing User-Agent", {
      userAgent: "EMPTY",
      method: req.method,
      path: req.originalUrl,
      headers: redactHeaders(req.headers),
      ref: referer,
      origin,
    });

    return res.status(403).json({ error: "Access denied." });
  }

  // 4) Pokud není origin → není to rozšíření (curl, Postman…)
  // ---------------------------------------------------
  if (!origin) {
    warn(`🚨 Non-extension request (no Origin) – IP ${ip}`);

    addToBlacklist(ip, "No Origin (bot/tool)", {
      userAgent: ua,
      method: req.method,
      path: req.originalUrl,
      headers: redactHeaders(req.headers),
      ref: referer,
      origin,
    });

    return res.status(403).json({ error: "Access denied." });
  }

  // 5) Pokud origin NENÍ tvoje extension → blok
  // ---------------------------------------------------
  if (!origin.startsWith(CHROME_EXTENSION_ALL_URL)) {
    warn(`🚨 Blocked non-extension request – IP ${ip}`);

    addToBlacklist(ip, "Origin not allowed", {
      userAgent: ua,
      method: req.method,
      path: req.originalUrl,
      headers: redactHeaders(req.headers),
      ref: referer,
      origin,
    });

    return res.status(403).json({ error: "Access denied." });
  }

  // 6) Fallback (nemělo by nastat)
  return next();
}
