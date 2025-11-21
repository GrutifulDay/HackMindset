// IMPORTY
import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { addToBlacklist } from "./ipBlacklist.js";
import { UAParser } from "ua-parser-js";
import { redactHeaders } from "../utils/redact.js";
import { warn } from "../utils/logger.js";

// ORIGINY POVOLENÉ PRO API
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "https://hackmindset.app",
  CHROME_EXTENSION_ALL_URL
];

// ZÁKLADNÍ POVOLENÉ HEADERY A METODY
const corsOptions = {
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

export default async function corsWithLogging(req, res, next) {
  const origin = req.headers.origin || null;
  const isLocalRequest =
    req.hostname === "localhost" ||
    req.hostname === "127.0.0.1";

  // -------------------------------------------------------------------
  // 🔥 1) Preflight (OPTIONS) MUSÍ projít BEZPEČNOSTNÍMI VRSTVAMI
  // -------------------------------------------------------------------
  if (req.method === "OPTIONS") {
    return cors({
      ...corsOptions,
      origin: origin || "*"   // Chrome extension často nemá origin
    })(req, res, next);
  }

  // -------------------------------------------------------------------
  // 🔥 2) Požadavky BEZ ORIGINU nesmí být blokované – Chrome ext, mobile fetch, cron
  // -------------------------------------------------------------------
  if (!origin && !isLocalRequest) {
    return cors({
      ...corsOptions,
      origin: false // odpoví bez CORS hlaviček, ale nezablokuje
    })(req, res, next);
  }

  // -------------------------------------------------------------------
  // 🔒 3) PODEZŘELÝ origin → log + blacklist + 403
  // -------------------------------------------------------------------
  const originNotAllowed = origin && !allowedOrigins.includes(origin);

  if (originNotAllowed && !isLocalRequest) {
    const uaString = req.get("User-Agent") || "Neznámý";
    const parser = new UAParser(uaString);
    const parsedUA = parser.getResult();
    const clientIP = req.ip || "Neznámá IP";

    warn(`[CORS BLOCKED] Origin: ${origin} | Path: ${req.originalUrl}`);

    // 🔒 Notifikace
    await notifyBlockedIP({
      ip: clientIP,
      reason: "CORS Blocked",
      userAgent: uaString,
      browser: parsedUA.browser?.name,
      os: parsedUA.os?.name,
      deviceType: parsedUA.device?.type,
      method: req.method,
      path: req.originalUrl,
      origin: origin,
      referer: req.get("Referer"),
      headers: redactHeaders(req.headers),
    });

    // 🔒 Blacklist
    await addToBlacklist(clientIP, "CORS Blocked", {
      userAgent: uaString,
      method: req.method,
      path: req.originalUrl
    });

    return res.status(403).json({
      error: "Přístup zablokován CORS politikou"
    });
  }

  // -------------------------------------------------------------------
  // ✔️ 4) Standardní CORS
  // -------------------------------------------------------------------
  return cors({
    ...corsOptions,
    origin: origin || "*"
  })(req, res, next);
}
