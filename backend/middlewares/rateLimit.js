import rateLimit from "express-rate-limit";
import { addToBlacklist } from "./ipBlacklist.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { debug } from "../utils/logger.js";

const offenders = new Map();

const WINDOW_MS = 10 * 60 * 1000; // 10 minut
const THRESHOLD = 10; // počet RL hitů během okna pro blacklist

const makeKey = (ip, ua) => `${ip}::${ua}`;

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

const limiterApi = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => req.originalUrl.includes("/get-token") ? 60 : 300,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => normalizeIp(req.ip),

  // pokud prijde pozadavek z extension, je to ok 
  skip: (req) => {
    const origin = req.headers.origin || req.headers.referer || "";
    const ua = req.get("User-Agent") || "";
    return (
      origin.startsWith("chrome-extension://") ||
      ua.includes("Chrome/") && ua.includes("Safari")
    );
  },

  handler: async (req, res) => {
    const ip = normalizeIp(req.ip);
    const ua = req.get("User-Agent") || "Unknown-UA";

    const key = makeKey(ip, ua);
    const now = Date.now();

    let record = offenders.get(key);

    // -----------------------
    // RESET OKNA → správně na začátku
    // -----------------------
    if (!record || now - record.firstHit > WINDOW_MS) {
      record = {
        count: 0,            // reset
        firstHit: now,       // nové okno
        notified: false      // ještě jsme neposílali hlášení
      };
    }

    // pricteni az po resetu
    record.count += 1;
    offenders.set(key, record);

    // -----------------------
    // Jednorázová notifikace (první RL hit v okně)
    // -----------------------
    if (!record.notified) {
      record.notified = true;
      await notifyBlockedIP({
        ip,
        reason: "Rate limit exceeded (first warning in window)",
        path: req.originalUrl,
        userAgent: ua,
      });
    }

    // -----------------------
    // BLACKLIST: 10 hitů během 10 minut
    // -----------------------
    if (record.count >= THRESHOLD) {
      await addToBlacklist(ip, "Repeated rate-limit abuse", {
        userAgent: ua,
        path: req.originalUrl,
      });

      offenders.delete(key);
    }

    return res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
    });
  },
});

export default limiterApi;
