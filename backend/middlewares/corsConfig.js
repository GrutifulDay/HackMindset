import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { UAParser } from "ua-parser-js";
import { redactHeaders } from "../utils/redact.js";

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

export default function corsWithLogging(req, res, next) {
  const origin = req.headers.origin;

  if (!origin || !allowedOrigins.includes(origin)) {
    const uaString = req.get("User-Agent") || "Neznámý";
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    console.warn(`[CORS BLOCKED] Origin: ${origin || "null"} - ${new Date().toISOString()}`);

    notifyBlockedIP({
      ip: req.ip || "Neznámé",
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

    return res.status(403).json({ error: "access denied" });
  }

  return cors({
    ...corsOptions,
    origin: origin
  })(req, res, next);
}
