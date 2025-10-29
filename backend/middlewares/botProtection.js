import { addToBlacklist } from "./ipBlacklist.js";
import { UAParser } from "ua-parser-js"
import { redactHeaders } from "../utils/redact.js";
import { warn } from "../utils/logger.js";


// ✅ Pomocná funkce pro správné získání IP adresy
function getUserIP(req) {
    return (
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        "neznámá IP"
    )
}

export default function botProtection(req, res, next) {
    const userAgentString = req.get("User-Agent");
    const userIP = getUserIP(req);

    // Výjimka pro Postman (volitelně odkomentovat při testech)
    // if (userAgentString && userAgentString.includes("Postman")) {
    //     info("🧪 Postman detekován – povolen.");
    //     return next();
    // }

    // ⛔️ Blokování bez user-agent
    if (!userAgentString) {
        warn(`🚨 Bot detekován (bez UA) – IP ${userIP}`);
    
        addToBlacklist(userIP, "Missing User-Agent", {
            userAgent: "EMPTY",
            method: req.method,
            path: req.originalUrl,
            headers: redactHeaders(req.headers),
            ref: req.get("referer"),
            origin: req.get("origin"),
          });
    
        return res.status(403).json({ error: "Request cannot be processed." })
    }

    // Analýza pomocí UAParser
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    const browserName = result.browser?.name || "Neznámý"
    const deviceType = result.device?.type || "Neznámý"
    const osName = result.os?.name || "Neznámý"

    // ⚠️ Podezřelý user-agent
    if (browserName === "Other" || browserName === undefined) {
        warn(`🚨 Podezřelý bot (${deviceType}, ${osName}) – IP ${userIP}`);
    
        addToBlacklist(userIP, "Suspicious User-Agent", {
            userAgent: userAgentString,
            browser: browserName,
            os: osName,
            deviceType: deviceType,
            method: req.method,
            path: req.originalUrl,
            headers: redactHeaders(req.headers),
            ref: req.get("referer"),
            origin: req.get("origin"),
          });
      
    
        return res.status(403).json({ error: "Request cannot be processed." })
    }

    next()
}
