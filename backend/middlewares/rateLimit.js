import rateLimit from "express-rate-limit";
import { addToBlacklist } from "./ipBlacklist.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { redactHeaders } from "../utils/redact.js";
import { debug } from "../utils/logger.js";


// const redact = (obj = {}) => {
//   const SENSITIVE = new Set(["authorization","cookie","proxy-authorization","x-api-key","set-cookie"]);
//   const out = {};
//   for (const [k, v] of Object.entries(obj)) {
//     out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
//   }
//   return out;
// };

// In-memory mapy (jen pro jeden proces, do restartu serveru)
const offenders = new Map();          // pocty prestupku pro IP

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

const limiterApi = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuta
  max: (req) => {
    if (req.originalUrl.includes("/get-token")) return 6; // prisnejsi limit pro vydavani tokenu
    return 100; // ostatni routy
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => normalizeIp(req.ip),

  // 💡 BONUS: rozšíření (chrome-extension://) limiter neomezuje
  skip: (req) => {
    const origin = req.headers.origin || req.headers.referer || "";
    const isFromExtension = origin.includes("chrome-extension://");
    return isFromExtension;
  },

  handler: async (req, res) => {
    const ip = normalizeIp(req.ip);
    const uaString = req.get("User-Agent") || "Neznámý";
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    debug(`⚠️ Rate limit exceeded for IP: ${ip}`);

    // zvysi prestupek hned
    const count = (offenders.get(ip) || 0) + 1;
    offenders.set(ip, count);

    if (count === 1) {
      await notifyBlockedIP({
        ip,
        city: "Neznámé",
        userAgent: uaString,
        browser: result.browser?.name || "Neznámý",
        os: result.os?.name || "Neznámý",
        deviceType: result.device?.type || "Neznámý",
        reason: "První rate-limit hit",
        method: req.method,
        path: req.originalUrl,
        headers: redactHeaders(req.headers), 
        origin: req.get("Origin"),
        referer: req.get("Referer"),
        requests: count,
      });
    }
      
    if (count >= 3) {
      await addToBlacklist(ip, "Opakované překročení rate limitu", {
        userAgent: uaString,
        browser: result.browser?.name,
        os: result.os?.name,
        deviceType: result.device?.type,
        method: req.method,
        path: req.originalUrl,
      });

      await notifyBlockedIP({
        ip,
        city: "Neznámé",
        userAgent: uaString,
        browser: result.browser?.name || "Neznámý",
        os: result.os?.name || "Neznámý",
        deviceType: result.device?.type || "Neznámý",
        reason: "Rate limit exceeded → Blacklist",
        method: req.method,
        path: req.originalUrl,
        headers: redactHeaders(req.headers), 
        origin: req.get("Origin"),
        referer: req.get("Referer"),
        requests: count,
      });

      offenders.delete(ip);
    }
      
    return res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
    });
  },

  keyGenerator: (req) => normalizeIp(req.ip),

  // skip: (req) => {
  //   const ignoredIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
  //   return ignoredIPs.includes(normalizeIp(req.ip));
  // },
});

export default limiterApi;
