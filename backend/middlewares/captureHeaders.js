import { notifyBlockedIP, maskToken } from "../utils/discordNotification.js";

// fce pro detekci hlavicek
const SENSITIVE = new Set([
  "cookie",
  "proxy-authorization",
  "set-cookie",
  "Authorization"
  // Authorization a X-API-Key 
]);

function redactHeaders(headers = {}) {
  const out = {};
  for (const [k, v] of Object.entries(headers)) {
    out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return out;
}

function detectSensitiveHeaders(headers) {
  const sensitive = [];

  if (headers["authorization"]) {
    sensitive.push(`Authorization: ${maskToken(headers["authorization"])}`);
  }

  if (headers["x-api-key"]) {
    sensitive.push(`X-API-Key: ${maskToken(headers["x-api-key"])}`);
  }

  if (headers["cookie"]) {
    sensitive.push("Cookie: [REDACTED]");
  }

  if (headers["proxy-authorization"]) {
    sensitive.push("Proxy-Authorization: [REDACTED]");
  }

  return sensitive;
}

function formatHeaders(headers = {}) {
  const keys = [
    "origin",
    "user-agent",
    "x-hackmindset",
    "postman-token",
    "x-forwarded-for",
    "host",
    "accept",
    "accept-encoding",
    "connection",
  ];

  const lines = [];
  for (const k of keys) {
    const v = headers[k] ?? headers[k.toLowerCase()] ?? null;
    if (v !== null && v !== undefined) lines.push(`→ ${k}: ${v}`);
  }

  if (lines.length === 0) {
    const small = Object.entries(headers).slice(0, 8);
    for (const [k, v] of small) lines.push(`→ ${k}: ${v}`);
  }

  return lines.join("\n");
}

export default function captureHeaders(options = {}) {
  const notifyOn = options.notifyOn;

  return async function (req, res, next) {
    try {
      const raw = redactHeaders(req.headers || {});
      const summary = formatHeaders(raw);
      const sensitive = detectSensitiveHeaders(req.headers || {});

      req._headersSummary = summary;
      req._redactedHeaders = raw;

      console.log("📦 PŘÍCHOZÍ HLAVIČKY:");
      summary.split("\n").forEach(line => console.log(line));

      if (sensitive.length > 0) {
        console.log("🔑 Sensitive headers detected:");
        sensitive.forEach(s => console.log("  " + s));
      }

      if (typeof notifyOn === "function" && notifyOn(req)) {
        try {
          await notifyBlockedIP({
            ip: req.ip || req.headers["x-forwarded-for"] || "Unknown",
            city: "Unknown",
            userAgent: req.get("User-Agent") || "Unknown",
            reason: options.notifyReason || "Suspicious client",
            method: req.method,
            path: req.originalUrl,
            headers: raw,
            sensitive,
          });
        } catch (e) {
          console.error("Notify error in captureHeaders:", e.message || e);
        }
      }
    } catch (err) {
      console.error("captureHeaders error:", err.message || err);
    }

    return next();
  };
}
