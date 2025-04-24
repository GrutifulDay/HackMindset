import BlacklistedIP from "../models/BlacklistedIP.js";

// set se uklada do restartu serveru - je potreba fce pro ukladani  
const blacklistedIPs = new Set();

// IP adresy, které se nikdy neblokují (lokální prostředí)
const ignoredIPs = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

// Middleware pro blokovani IP
export default function ipBlocker(req, res, next) {
  const clientIP = req.ip;

  // Ignor zname lokalni IP
  if (ignoredIPs.has(clientIP)) {
    return next();
  }

  // Zkontroluj, jestli je IP na blacklistu
  if (blacklistedIPs.has(clientIP)) {
    console.warn(`🚨 Přístup zablokován pro IP: ${clientIP}`);
    console.log("🔍 Detekovaná IP:", clientIP);
    return res.status(403).json({ error: "Vaše IP adresa byla zablokována." });
  }

  next();
}

// Funkce pro pridani IP do blacklistu   
export async function addToBlacklist(ip) {
  if (ignoredIPs.has(ip)) {
    console.log(`ℹ️ IP ${ip} je na seznamu výjimek (localhost), nebude blokována.`);
    return false;
  }

  if (!blacklistedIPs.has(ip)) {
    blacklistedIPs.add(ip);
    console.warn(`🧨 IP ${ip} přidána do Setu`);

    try {
      const exists = await BlacklistedIP.findOne({ ip });
      if (!exists) {
        const newIP = new BlacklistedIP({ ip });
        await newIP.save();
        console.log(`🛑 IP ${ip} uložena do databáze`);
      } else {
        console.log(`⚠️ IP ${ip} už v databázi existuje`);
      }
    } catch (err) {
      console.error("❌ Chyba při ukládání IP do DB:", err.message);
    }

    return true;
  }

  return false; // už v Setu
}

export async function loadBlacklistFromDB() {
  try {
    const allBlocked = await BlacklistedIP.find()
    allBlocked.forEach(entry => blacklistedIPs.add(entry.ip))
    console.log(`✅ Načteno ${allBlocked.length} IP adres z DB do paměti`);
  } catch (err) {
    console.error("❌ Chyba při načítání blacklistu z DB:", err.message);
  }
}

