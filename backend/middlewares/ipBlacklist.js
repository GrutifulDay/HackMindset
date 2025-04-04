import BlacklistedIP from "../models/BlacklistedIP.js";

// In-memory storage pro rychlou kontrolu
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

// Funkce pro dani IP do blacklistu   
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




// const blacklistedIPs = new Set() //pouziti set pro neopakovani IP adres

// export default function ipBlocker(req, res, next) {
//     const clientIP = req.ip

//     //pokud je IP na BL, blokuje pristup
//     if (blacklistedIPs.has(clientIP)) {
//         console.warn(`🚨 Přístup zablokován pro IP: ${clientIP}`);
//         return res.status(403).json({ error: "Vaše IP adresa byla zablokována." });
//     }

//     next()
// }

// export function addToBlacklist(ip) {
//     if (!blacklistedIPs.has(ip)) {
//         blacklistedIPs.add(ip);
//         console.warn(`🧨 IP ${ip} byla přidána na blacklist!`);
//         return true; // Vracie true pokud adresa byla pridana 
//     }
//     return false; // ❌ IP uz na blacklistu byla
// }





// import BlacklistedIP from "../models/BlacklistedIP.js";
// import chalk from "chalk";

// export async function addToBlacklist(ip) {
//   try {
//     const ipString =
//       typeof ip === "string"
//         ? ip
//         : ip?.address || ip?.ip || JSON.stringify(ip); // uprav podle struktury

//     if (!ipString || ipString.includes("[object")) {
//       console.warn("⚠️ Neplatná IP:", ip);
//       return;
//     }

//     console.log("IP input:", ip);


//     const exists = await BlacklistedIP.findOne({ ip: ipString });
//     if (exists) return;

//     const newIP = new BlacklistedIP({ ip: ipString });
//     await newIP.save();

//     console.log(chalk.red.bold(`🛑 IP ${ipString} přidána na blacklist.`));
//   } catch (err) {
//     console.error("❌ Chyba při přidávání IP do blacklistu:", err.message);
//   }
// }

// export default addToBlacklist