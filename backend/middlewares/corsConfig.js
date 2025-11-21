import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { addToBlacklist } from "./ipBlacklist.js";   // ✅ přidáno
import { UAParser } from "ua-parser-js";
import { redactHeaders } from "../utils/redact.js";
import { warn } from "../utils/logger.js";


const allowedOrigins = [
  "http://127.0.0.1:5501",
  "https://hackmindset.app",
  CHROME_EXTENSION_ALL_URL
];

const corsOptions = {
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

export default async function corsWithLogging(req, res, next) {
  const origin = req.headers.origin;
  const isLocalRequest = req.hostname === "localhost" || req.hostname === "127.0.0.1";


  // ❌ Pokud není origin nebo není v seznamu povolených
  if ((!origin || !allowedOrigins.includes(origin)) && !isLocalRequest) {
    const uaString = req.get("User-Agent") || "Neznámý";
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    const clientIP = req.ip || "Neznámé";

    warn(`[CORS BLOCKED] Origin: ${origin || "null"} - ${new Date().toISOString()}`);

    // ✅ 1. Zaloguj blokaci (Discord)
    await notifyBlockedIP({
      ip: clientIP,
      reason: "CORS Blocked",
      userAgent: uaString,
      method: req.method,
      path: req.originalUrl,
      city: "Neznámé",
      origin,
      browser: result.browser?.name || "Neznámý",
      os: result.os?.name || "Neznámý",
      deviceType: result.device?.type || "Neznámý",
      referer: req.get("Referer"),
      headers: redactHeaders(req.headers),
    });

    // ✅ 2. Přidej IP do blacklistu
    await addToBlacklist(clientIP, "CORS Blocked", {
      userAgent: uaString,
      browser: result.browser?.name,
      os: result.os?.name,
      deviceType: result.device?.type,
      method: req.method,
      path: req.originalUrl,
    });

    // ✅ 3. Okamžitě vrať chybu
    return res.status(403).json({ error: "Access blocked by CORS policy" });
  }

  // ✅ Jinak – standardní CORS
  return cors({
    ...corsOptions,
    origin: origin
  })(req, res, next);
}