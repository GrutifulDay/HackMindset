import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { INTERNAL_API_KEYS, ALLOW_LOCAL_NO_PROXY, HACK_EXTENSION } from "../config.js";

// 🔐 Middleware pro validaci přístupu (proxy-only + serverové tajemství)
export function validateApiKey(routeDescription = "api") {
  console.log("validateApiKey ✅ aktivní");

  const ALLOWED_METHODS = new Set(["GET", "POST", "HEAD", "OPTIONS"]);
  const INTERNAL_HEADER_NAME = "x-internal-auth";
  const VALID_KEYS = new Set(INTERNAL_API_KEYS);

  const safeEq = (a, b) => {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const A = Buffer.from(a, "utf8");
    const B = Buffer.from(b, "utf8");
    if (A.length !== B.length) return false;
    try { return crypto.timingSafeEqual(A, B); } catch { return false; }
  };

  return async function (req, res, next) {
    // 0) Metody
    if (req.method === "OPTIONS") return res.sendStatus(204);
    if (!ALLOWED_METHODS.has(req.method)) {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 1) IP + blacklist
    const userIP = req.ip || "neznámá IP";
    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "Vaše IP je na blacklistu." });
    }

    // 2) Bearer z frontendu = jen visačka (nerozhoduje)
    const auth = req.headers.authorization || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    const transformedBearer = bearer === "HACK_EXTENSION" ? HACK_EXTENSION : bearer;

    // 3) Hlavní autorita: interní hlavička z proxy
    const internalHeader = req.get("X-Internal-Auth") || "";
    let allowed = false;

    if (internalHeader && VALID_KEYS.size > 0) {
      for (const k of VALID_KEYS) {
        if (safeEq(String(internalHeader), String(k))) { allowed = true; break; }
      }
    }

    // 3b) DEV výjimka: localhost bez proxy (jen pokud ALLOW_LOCAL_NO_PROXY=1)
    if (!allowed && ALLOW_LOCAL_NO_PROXY && VALID_KEYS.size > 0) {
      const isLoopback =
        userIP === "127.0.0.1" || userIP === "::1" || userIP === "::ffff:127.0.0.1";
      if (isLoopback) {
        for (const k of VALID_KEYS) {
          if (safeEq(String(transformedBearer), String(k))) { allowed = true; break; }
        }
      }
    }

    if (allowed) return next();

    // 4) Neúspěch → KONKRÉTNÍ reason + kontext → blacklist + 403/401
    try {
      const ua = req.get("User-Agent") || "Neznámý";
      const parser = new UAParser(ua);
      const result = parser.getResult();
      const city = await getCityByIP(userIP);

      // Rozliš konkrétní důvod selhání
      const failedBecause = internalHeader
        ? "invalidInternalAuth"   // hlavička byla, ale klíč nesedí
        : "invalidApiKey";        // žádná interní hlavička → volání mimo proxy

      await addToBlacklist(userIP, failedBecause, {
        // IP/geo
        city: city || "Neznámý",
        // request kontext
        endpoint: req.originalUrl,
        method: req.method,
        userAgent: ua,
        // app vrstva + status
        layer: "express",
        statusCode: failedBecause === "invalidInternalAuth" ? 403 : 401,
        // doplň si klidně i ruleId/ruleName/tags podle chuti:
        // ruleId: "AUTH001",
        // ruleName: routeDescription,
        // tags: ["auth","proxy"],
        // cokoliv dalšího umíš doplnit (country/asn/isp/reverseDns) sem
      });
    } catch {
      // nechceme shodit request kvůli chybě v blacklistu
    }

    return res.status(403).json({ error: "Neplatný přístup" });
  };
}
