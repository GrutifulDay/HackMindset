// middlewares/ipBlocker.js
import BlacklistedIP from "../models/BlacklistedIP.js"
import { notifyBlockedIP } from "../utils/discordNotification.js"
import { saveSecurityLog } from "../services/securityLogService.js"

// set se uklada do restartu serveru  
const blacklistedIPs = new Set()

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

// IP adresy, které se nikdy neblokují (lokální/provozní prostředí)
const ignoredIPs = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

// Redakce citlivých hodnot v query/hlavičkách
const redact = (obj = {}) => {
  const SENSITIVE = new Set(["password","pass","token","apikey","api_key","authorization","cookie"]);
  const out = {};
  for (const [k,v] of Object.entries(obj)) {
    out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return out;
};

/**
 * Pomůcka: naplň info z Express requestu (lze přepsat přes overrides).
 * Používej v rate-limiteru / validateApiKey / geo-bloku:
 *   addToBlacklist(ip, "rateLimitExceeded (30/min)", buildNotifyInfo(req, { requestsCount: 47, requestsWindow: "60s" }))
 */
export function buildNotifyInfo(req, overrides = {}) {
  const base = {
    endpoint: req.originalUrl,
    method: req.method,
    userAgent: req.get("user-agent") || "Neznámý",
    layer: "express",            // výchozí – přepiš v proxy/NGINX na "openresty"
    statusCode: 403,             // přepiš na 429 u rate-limit nebo 401 u API key
  };
  return { ...base, ...overrides };
}

// Middleware pro blokovani IP
export default async function ipBlocker(req, res, next) {
  const clientIP = normalizeIp(req.ip)

  // 🧲 Honeypoint výjimka – nikdy neblokovat přístup
  if (req.originalUrl === "/api/feedbackForm") {
    return next()
  }

  // Allowlist
  if (ignoredIPs.has(clientIP)) {
    return next()
  }

  // Zablokovaná IP → zaloguj, co zkouší, a vrať 403
  if (blacklistedIPs.has(clientIP)) {
    try {
      await saveSecurityLog({
        src: "express",
        kind: "blocked",
        ip: clientIP,                          // už normalizovaná
        method: req.method,
        host: req.headers.host,
        path: req.path,                        // bez query stringu
        status: 403,
        ua: req.get("user-agent"),
        ref: req.get("referer"),
        rule: "ip_blacklist",
        note: "Blocked by ipBlacklist middleware",
        raw: {
          query: redact(req.query),            // co poslal v URL (sanitováno)
          headers: redact({
            origin: req.get("origin"),
            authorization: req.get("authorization"),
            "content-type": req.get("content-type"),
          }),
          body: redact(req.body || {}),
        },
      });
    } catch (e) {
      console.error("sec-log save error:", e.message);
    }
    return res.status(403).json({ error: "Vaše IP adresa byla zablokována." })
  }

  return next()
}

// Funkce pro pridani IP do blacklistu do DB  
export async function addToBlacklist(ip, reason, info = {}) {
  ip = normalizeIp(ip);
  if (!ip) return false;

  // DŮLEŽITÉ: reason nechci defaultovat na generické – ať se vždy pošle konkrétní
  if (!reason || typeof reason !== "string") {
    console.warn(`⚠️ addToBlacklist: prázdný nebo neplatný reason pro IP ${ip} – nahrazuji 'unspecified'`);
    reason = "unspecified"; // raději explicitní než zavádějící „Automatické blokování“
  }

  // nepřidávej vlastní server / localhost
  if (ignoredIPs.has(ip)) {
    console.log(`ℹ️ ${ip} je v allowlistu – přeskočeno.`);
    return false;
  }

  console.log("📥 Ukládám do blacklistu:", ip, info.city);

  if (!blacklistedIPs.has(ip)) {
    blacklistedIPs.add(ip) // pridava do pameti 
    console.warn(`🧨 IP ${ip} přidána do Setu (důvod: ${reason})`)

    try {
      const exists = await BlacklistedIP.findOne({ ip })
      if (!exists) {
        const newIP = new BlacklistedIP({ 
          ip,
          reason,
          userAgent: info.userAgent || "Neznámý",
          browser: info.browser || "Neznámý",
          os: info.os || "Neznámý",
          deviceType: info.deviceType || "Neznámý",
          city: info.city || "Neznámý",
        })
        await newIP.save()
        console.log(`🛑 IP ${ip} uložena do databáze`);

        // ——— Bezpečné defaulty pro notify ———
        const layer = info.layer || "express";
        // Pokud důvod vypadá na rate-limit → 429, jinak nech 403 (lze přepsat v info)
        const statusCode = (info.statusCode != null)
          ? info.statusCode
          : (/rate|limit/i.test(reason) ? 429 : 403);

        // sanity log - pak smazat 
        console.log("notifyBlockedIP input →", {
          ip, reason,
          endpoint: info.endpoint,
          method: info.method,
          userAgent: info.userAgent,
          layer,
          statusCode
        });

        await notifyBlockedIP({
          ip,
          reason,
          country: info.country,
          city: info.city || "Neznámé",
          asn: info.asn,
          isp: info.isp,
          reverseDns: info.reverseDns,

          endpoint: info.endpoint,
          method: info.method,
          requestsCount: info.requestsCount,
          requestsWindow: info.requestsWindow,

          layer,
          statusCode,

          userAgent: info.userAgent || "Neznámý",
          occurredAt: new Date()
        })
      } else {
        console.log(`⚠️ IP ${ip} už v databázi existuje`);
        // ZDE schválně neposílám Discord znovu, ať nespamujeme kanál
      }
    } catch (err) {
      console.error("❌ Chyba při ukládání IP do DB:", err.message);
    }

    return true
  }

  return false // už v Setu
}

// Načtení blacklistu do paměti (bez allowlistu)
export async function loadBlacklistFromDB() {
  try {
    const allBlocked = await BlacklistedIP.find({}, { ip: 1 });
    blacklistedIPs.clear();
    allBlocked.forEach(entry => {
      const ip = normalizeIp(entry.ip);
      if (ip && !ignoredIPs.has(ip)) blacklistedIPs.add(ip);
    });
    console.log(`✅ Načteno ${blacklistedIPs.size} IP adres z DB do paměti`)
  } catch (err) {
    console.error("❌ Chyba při načítání blacklistu z DB:", err.message);
  }
}

export async function isBlacklisted(ip) {
  try {
    ip = normalizeIp(ip);
    const found = await BlacklistedIP.findOne({ ip })
    return !!found
  } catch (err) {
    console.error("❌ Chyba při kontrole blacklistu:", err.message);
    return false
  }
}
