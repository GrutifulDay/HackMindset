import BlacklistedIP from "../models/BlacklistedIP.js"
import { notifyBlockedIP } from "../utils/discordNotification.js"

// ❌ = ZAKOMENTUJ PRO TESTY ❌ 

// set se uklada do restartu serveru  
const blacklistedIPs = new Set()

const normalizeIp = (ip) => {
  if (!ip) return ip;
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
};

// ❌
// IP adresy, které se nikdy neblokují (lokální prostředí)
const ignoredIPs = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1", "172.104.157.204"]);

// Middleware pro blokovani IP
export default function ipBlocker(req, res, next) {
  const clientIP = normalizeIp(req.ip)

  // 🧲 Honeypoint výjimka – nikdy neblokovat přístup
  if (req.originalUrl === "/api/feedbackForm") {
    console.log("🧲 Výjimka: /api/feedbackForm – IP nebude blokována");
    return next() // okamžitě pustit dál
  }

  // ❌
  // Ignor zname lokalni IP
  if (ignoredIPs.has(clientIP)) {
    return next()
  }

  // Zkontroluj, jestli je IP na blacklistu
  if (blacklistedIPs.has(clientIP)) {
    console.warn(`🚨 Přístup zablokován pro IP: ${clientIP}`);
    console.log("🔍 Detekovaná IP:", clientIP);
    return res.status(403).json({ error: "Vaše IP adresa byla zablokována." })
  }

  return next()
}

// Funkce pro pridani IP do blacklistu do DB  
export async function addToBlacklist(ip, reason = "Automatické blokování", info = {}) {

  ip = normalizeIp(ip);
  if (!ip) return false;

  // nepřidávej vlastní server / localhost
  if (ignoredIPs.has(ip)) {
    console.log(`ℹ️ ${ip} je v allowlistu – přeskočeno.`);
    return false;
  }

  // ❌ 
  //ignor Postman
  // if (ignoredIPs.has(ip)) {
  //   console.log(`ℹ️ IP ${ip} je na seznamu výjimek (localhost), nebude blokována.`);
  //   return false
  // }

  console.log("📥 Ukládám do blacklistu:", ip, info.city);

  if (!blacklistedIPs.has(ip)) {
    blacklistedIPs.add(ip) // pridava do pameti 
    console.warn(`🧨 IP ${ip} přidána do Setu (důvod: ${reason})`)

    try {
      const exists = await BlacklistedIP.findOne({ ip })
      if (!exists) {
        const newIP = new BlacklistedIP({ 
          ip: ip || "Neznámá IP",
          reason,
          userAgent: info.userAgent || "Neznámý",
          browser: info.browser || "Neznámý",
          os: info.os || "Neznámý",
          deviceType: info.deviceType || "Neznámý",
          city: info.city || "Neznámý",
        })
        
        await newIP.save() // ulozi do Mongo
        console.log(`🛑 IP ${ip} uložena do databáze`);
        await notifyBlockedIP(ip, info.city, reason)
      } else {
        console.log(`⚠️ IP ${ip} už v databázi existuje`);
      }
    } catch (err) {
      console.error("❌ Chyba při ukládání IP do DB:", err.message);
    }

    return true
  }

  return false // už v Setu
}

// pomocna funkce pro pro kontrolu IP adres po setu  
export async function loadBlacklistFromDB() {
  try {
    const allBlocked = await BlacklistedIP.find({}, { ip: 1 });
    blacklistedIPs.clear();  // ať se to nena-skládá duplicitně po víc restartech
    allBlocked.forEach(entry => {
      const ip = normalizeIp(entry.ip);
      if (ip && !ignoredIPs.has(ip)) blacklistedIPs.add(ip);
    });
    console.log(`✅ Načteno ${blacklistedIPs.size} IP adres z DB do paměti`);
  } catch (err) {
    console.error("❌ Chyba při načítání blacklistu z DB:", err.message);
  }
}

export async function isBlacklisted(ip) {
  try {
    ip = normalizeIp(ip);
    const found = await BlacklistedIP.findOne({ ip });
    return !!found;
  } catch (err) {
    console.error("❌ Chyba při kontrole blacklistu:", err.message);
    return false;
  }
}