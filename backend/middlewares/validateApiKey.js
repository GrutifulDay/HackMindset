import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { INTERNAL_API_KEYS, ALLOW_LOCAL_NO_PROXY, HACK_EXTENSION } from "../config.js";

// 🔐 Middleware pro validaci přístupu (proxy-only + serverové tajemství)
export function validateApiKey(routeDescription = "api") {

  const ALLOWED_METHODS = new Set(["GET", "POST", "HEAD", "OPTIONS"]);
  const VALID_KEYS = new Set(INTERNAL_API_KEYS);

  const safeEq = (a, b) => {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const A = Buffer.from(a, "utf8");
    const B = Buffer.from(b, "utf8");
    if (A.length !== B.length) return false;
    try { return crypto.timingSafeEqual(A, B); } catch { return false; }
  };

  return async function (req, res, next) {
    console.log("\n🔐 === validateApiKey aktivní ===");
    console.log("→ URL:", req.originalUrl);
    console.log("→ METHOD:", req.method);
    console.log("→ IP:", req.ip);
    console.log("→ ALLOW_LOCAL_NO_PROXY:", ALLOW_LOCAL_NO_PROXY);
    console.log("→ VALID_KEYS:", [...VALID_KEYS]);

    // Vypiš všechny příchozí hlavičky (pro ladění proxy!)
    console.log("📦 Příchozí hlavičky:");
    for (const [key, value] of Object.entries(req.headers)) {
      console.log(`→ ${key}: ${value}`);
    }

    // 0) OPTIONS
    if (req.method === "OPTIONS") {
      console.log("➡️ OPTIONS request – propouštím bez validace.");
      return res.sendStatus(204);
    }

    // 1) Nepovolená metoda
    if (!ALLOWED_METHODS.has(req.method)) {
      console.warn("⛔ Nepovolená metoda:", req.method);
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 2) Kontrola blacklistu
    const userIP = req.ip || "neznámá IP";
    if (await isBlacklisted(userIP)) {
      console.warn("⛔ IP je na blacklistu:", userIP);
      return res.status(403).json({ error: "Vaše IP je na blacklistu." });
    }

    // 3) Autorizace – proxy hlavička
    const internalHeader = req.get("X-Internal-Auth") || "";
    let allowed = false;

    console.log("🔍 internalHeader:", `"${internalHeader}"`);
    for (const k of VALID_KEYS) {
      if (safeEq(internalHeader, k)) {
        allowed = true;
        console.log("✅ Povolen přístup přes proxy klíč:", k);
        break;
      }
    }

    // 4) Výjimka pro localhost (vývoj)
    if (!allowed && ALLOW_LOCAL_NO_PROXY) {
      const isLoopback =
        userIP === "127.0.0.1" || userIP === "::1" || userIP === "::ffff:127.0.0.1";
      if (isLoopback) {
        // transformace Beareru
        const auth = req.headers.authorization || "";
        const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
        const transformedBearer = bearer === "HACK_EXTENSION" ? HACK_EXTENSION : bearer;

        console.log("🧪 Dev výjimka aktivní:");
        console.log("→ userIP (loopback):", userIP);
        console.log("→ transformedBearer:", `"${transformedBearer}"`);

        for (const k of VALID_KEYS) {
          if (safeEq(transformedBearer, k)) {
            allowed = true;
            console.log("✅ Dev výjimka povolila přístup (localhost + platný klíč)");
            break;
          }
        }
      }
    }

    // 5) Výsledek
    if (allowed) {
      console.log("🎉 Přístup povolen ✅\n");
      return next();
    }

    // 6) Neúspěch → přidání na blacklist
    console.warn("⛔ Přístup zamítnut – přidávám na blacklist");
    try {
      const ua = req.get("User-Agent") || "Neznámý";
      const parser = new UAParser(ua);
      const result = parser.getResult();
      const city = await getCityByIP(userIP);

      await addToBlacklist(userIP, routeDescription, {
        userAgent: ua,
        browser: result.browser?.name || "Neznámý",
        os: result.os?.name || "Neznámý",
        deviceType: result.device?.type || "Neznámý",
        city: city || "Neznámý",
      });
    } catch (err) {
      console.error("⚠️ Chyba při přidávání na blacklist:", err.message);
    }

    return res.status(403).json({ error: "Neplatný přístup" });
  };
}
