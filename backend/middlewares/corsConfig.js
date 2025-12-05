import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { addToBlacklist } from "./ipBlacklist.js";
import { UAParser } from "ua-parser-js";
import { redactHeaders } from "../utils/redact.js";
import { warn } from "../utils/logger.js";

// Povolené originy
const allowedOrigins = [
  "https://hackmindset.app",
  "http://127.0.0.1:5501",
  CHROME_EXTENSION_ALL_URL  // Např. chrome-extension://abcd...
];

// Base CORS options
const corsOptionsBase = {
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// Robustní test, zda jde o Chrome Extension
function isChromeExtension(origin, referer) {
  return (
    (origin && origin.startsWith("chrome-extension://")) ||
    (referer && referer.startsWith("chrome-extension://"))
  );
}

// Lokální vývoj = browser posílá ORIGIN
function isLocalOrigin(origin) {
  return (
    origin === "http://localhost" ||
    origin === "http://127.0.0.1:5501"
  );
}

export default async function corsWithLogging(req, res, next) {
  const origin = req.headers.origin || null;
  const referer = req.headers.referer || null;
  const ua = req.get("User-Agent") || "";

  const extensionRequest = isChromeExtension(origin, referer);

  // --------------------------------------------------------------------
  // 1) Preflight OPTIONS — MUSÍ odpovídat přesně tomu, co bude platit i po něm
  // --------------------------------------------------------------------
  if (req.method === "OPTIONS") {

    // Chrome extension
    if (extensionRequest) {
      return res
        .status(204)
        .set({
          "Access-Control-Allow-Origin": CHROME_EXTENSION_ALL_URL,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Allow-Credentials": "true"
        })
        .end();
    }

    // Lokální vývoj
    if (isLocalOrigin(origin)) {
      return res
        .status(204)
        .set({
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        })
        .end();
    }

    // Validní origin
    if (allowedOrigins.includes(origin)) {
      return res
        .status(204)
        .set({
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        })
        .end();
    }

    // Neoprávněný origin → blokace
    return res.status(403).json({ error: "Access blocked by CORS policy" });
  }

  // --------------------------------------------------------------------
  // 2) Chrome Extension request — povol bezpečně
  // --------------------------------------------------------------------
  if (extensionRequest) {
    return cors({
      ...corsOptionsBase,
      origin: CHROME_EXTENSION_ALL_URL,
    })(req, res, next);
  }

  // --------------------------------------------------------------------
  // 3) Lokální vývoj
  // --------------------------------------------------------------------
  if (isLocalOrigin(origin)) {
    return cors({
      ...corsOptionsBase,
      origin: origin,
    })(req, res, next);
  }

  // --------------------------------------------------------------------
  // 4) Neoprávněný ORIGIN (pokud je definovaný)
  // --------------------------------------------------------------------
  if (origin && !allowedOrigins.includes(origin)) {
    const clientIP = req.ip || "Neznámé";
    const parser = new UAParser(ua);
    const parsedUA = parser.getResult();

    warn(`[CORS BLOCKED] Origin: ${origin} - ${new Date().toISOString()}`);

    await notifyBlockedIP({
      ip: clientIP,
      reason: "CORS Blocked",
      userAgent: ua,
      method: req.method,
      path: req.originalUrl,
      city: "Neznámé",
      origin,
      browser: parsedUA.browser?.name,
      os: parsedUA.os?.name,
      deviceType: parsedUA.device?.type,
      referer,
      headers: redactHeaders(req.headers),
    });

    await addToBlacklist(clientIP, "CORS Blocked", {
      userAgent: ua,
      method: req.method,
      path: req.originalUrl,
    });

    return res.status(403).json({ error: "Access blocked by CORS policy" });
  }

  // --------------------------------------------------------------------
  // 5) Request BEZ Origin hlavičky (curl, bot apod.)
  // → Nemůže být CORS exploit → ale nechceme povolit všechny
  // --------------------------------------------------------------------
  if (!origin) {
    // Pro rozšíření to není problém, ale pro web requesty ano.
    // Přístup bude povolen, pokud to není cross-site scénář.
    return next();
  }

  // --------------------------------------------------------------------
  // 6) Validní request z whitelisted originu
  // --------------------------------------------------------------------
  return cors({
    ...corsOptionsBase,
    origin: origin
  })(req, res, next);
}
