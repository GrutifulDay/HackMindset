import slowDown from "express-slow-down";
import { UAParser } from "ua-parser-js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { redactHeaders } from "../utils/redact.js";

// citlivé hlavičky anonymizujeme
// const redact = (obj = {}) => {
//   const SENSITIVE = new Set(["authorization","cookie","proxy-authorization","x-api-key","set-cookie"]);
//   const out = {};
//   for (const [k, v] of Object.entries(obj)) {
//     out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
//   }
//   return out;
// };

const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 min (změnit podle potřeby)
  delayAfter: 100,         // až po 100 požadavcích
  delayMs: () => 300,      // každý další request zpomalíme o 300ms
  message: "Too many requests – you are being slowed down."
});

async function logSlowRequests(req, res, next) {
  const used = req.slowDown?.current || 0;
  const limit = req.slowDown?.limit || 0;

  if (used > limit) {
    const uaString = req.get("User-Agent") || "Unknown";
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    console.warn(`🐌 IP ${req.ip} is slowed down: ${used}/${limit}`);
    res.setHeader("X-Slowed-Down", "true");

    await notifyBlockedIP({
      ip: req.ip,
      city: "Unknown",
      userAgent: uaString,
      browser: result.browser?.name || "Unknown",
      os: result.os?.name || "Unknown",
      deviceType: result.device?.type || "Unknown",
      reason: "Speed limiter triggered",
      method: req.method,
      path: req.originalUrl,
      headers: redactHeaders(req.headers), 
      origin: req.get("Origin"),
      referer: req.get("Referer"),
      requests: used
    });
  }

  next();
}

export default [speedLimiter, logSlowRequests];
