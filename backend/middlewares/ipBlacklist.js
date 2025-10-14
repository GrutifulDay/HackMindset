import BlacklistedIP from "../models/BlacklistedIP.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { saveSecurityLog } from "../services/securityLogService.js";
import { hashIp } from "../utils/hashIp.js";

// set se ukládá do paměti (reset po restartu serveru)
const blacklistedIPs = new Set();

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

// Redakce citlivých hodnot v query/hlavičkách
const redact = (obj = {}) => {
  const SENSITIVE = new Set(["password", "pass", "token", "apikey", "api_key", "authorization", "cookie"]);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = SENSITIVE.has(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return out;
};

// 🧱 Middleware pro blokování IP
export default async function ipBlocker(req, res, next) {
  const clientIP = normalizeIp(req.ip);
  const ipHash = hashIp(clientIP);

  // ✅ pokud hash existuje v paměti → blokuj
  if (blacklistedIPs.has(ipHash)) {
    try {
      await saveSecurityLog({
        src: "express",
        kind: "blocked",
        ip: clientIP,
        method: req.method,
        host: req.headers.host,
        path: req.path,
        status: 403,
        ua: req.get("user-agent"),
        ref: req.get("referer"),
        rule: "ip_blacklist",
        note: "Blocked by ipBlacklist middleware",
        raw: {
          query: redact(req.query),
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

    return res.status(403).json({ error: "Vaše IP adresa byla zablokována." });
  }

  return next();
}

// 🧩 Funkce pro přidání IP do blacklistu (DB + paměť)
export async function addToBlacklist(ip, reason = "Automatické blokování", info = {}) {
  ip = normalizeIp(ip);
  if (!ip) return false;

  const ipHash = hashIp(ip);
  if (blacklistedIPs.has(ipHash)) return false; // už existuje

  blacklistedIPs.add(ipHash);
  console.warn(`🧨 IP ${ip} přidána do Setu (důvod: ${reason})`);

  try {
    const exists = await BlacklistedIP.findOne({ ipHash });
    if (!exists) {
      const newIP = new BlacklistedIP({
        ipHash,
        reason,
        userAgent: info.userAgent || "Neznámý",
        browser: info.browser || "Neznámý",
        os: info.os || "Neznámý",
        deviceType: info.deviceType || "Neznámý",
        city: info.city || "Neznámý",
        method: info.method || "Neznámá",
        path: info.path || "Neznámá",
      });
      await newIP.save();
      console.log(`🛑 IP ${ip} uložena do databáze (hash: ${ipHash})`);

      await notifyBlockedIP({
        ip,
        city: info.city || "Neznámé",
        userAgent: info.userAgent || "Neznámý",
        reason,
        method: info.method || "?",
        path: info.path || "?",
        headers: info.headers || {},
      });
    } else {
      console.log(`⚠️ IP ${ip} (hash: ${ipHash}) už v databázi existuje`);
    }
  } catch (err) {
    console.error("❌ Chyba při ukládání IP do DB:", err.message);
  }

  return true;
}

// 🧠 Načtení blacklistu z DB do paměti
export async function loadBlacklistFromDB() {
  try {
    const allBlocked = await BlacklistedIP.find({}, { ipHash: 1 });
    blacklistedIPs.clear();

    allBlocked.forEach((entry) => {
      if (entry.ipHash) blacklistedIPs.add(entry.ipHash);
    });

    console.log(`✅ Načteno ${blacklistedIPs.size} IP adres z DB do paměti`);
  } catch (err) {
    console.error("❌ Chyba při načítání blacklistu z DB:", err.message);
  }
}

// 🧩 Kontrola, jestli IP existuje v blacklistu (DB)
export async function isBlacklisted(ip) {
  try {
    ip = normalizeIp(ip);
    const found = await BlacklistedIP.findOne({ ipHash: hashIp(ip) });
    return !!found;
  } catch (err) {
    console.error("❌ Chyba při kontrole blacklistu:", err.message);
    return false;
  }
}
