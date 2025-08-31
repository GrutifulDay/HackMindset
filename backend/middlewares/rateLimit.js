import rateLimit from "express-rate-limit";
import { addToBlacklist } from "./ipBlacklist.js";

const limiterApi = rateLimit({
    windowMs: 1 * 60 * 1000,    // 1 minuta
    max: 30,                    // max 30 požadavků za minutu
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        const ip = req.ip;
      
        console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
      
        await addToBlacklist(ip, "rateLimitExceeded (30/min)", {
          endpoint: req.originalUrl,
          method: req.method,
          userAgent: req.get("user-agent") || "Neznámý",
          requestsCount: 31,          // min. aktuální hodnota – můžeš sem později doplnit dynamicky
          requestsWindow: "60s",
          layer: "express",
          statusCode: 429,
        });
      
        return res.status(429).json({
          error: "Příliš mnoho požadavků – zkuste to prosím později.",
        });
      },
      
    keyGenerator: (req) => req.ip,
    skip: (req) => {
        // Výjimky: tvoje vlastní IP + rozšíření, pokud bude potřeba
        const ignoredIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
        return ignoredIPs.includes(req.ip);
    }
});

export default limiterApi;
