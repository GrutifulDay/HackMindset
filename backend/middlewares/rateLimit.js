import rateLimit from "express-rate-limit";
import { UAParser } from "ua-parser-js";
import { addToBlacklist } from "./ipBlacklist.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { redactHeaders } from "../utils/redact.js";
import { debug } from "../utils/logger.js";

const offenders = new Map();

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

const limiterApi = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.originalUrl.includes("/get-token")) return 6;
    return 100;
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => normalizeIp(req.ip),

  skip: (req) => {
    const origin = req.headers.origin || req.headers.referer || "";
    return origin.includes("chrome-extension://");
  },

  handler: async (req, res) => {
    const ip = normalizeIp(req.ip);

    const uaString = String(req.get("User-Agent") || "Unknown");
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    debug(`⚠️ Rate limit exceeded for IP: ${ip}`);

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
});

export default limiterApi;
