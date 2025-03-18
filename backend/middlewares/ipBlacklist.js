const blacklistedIPs = new Set() //pouziti set pro neopakovani IP adres

export default function ipBlocker(req, res, next) {
    const clientIP = req.ip

    //pokud je IP na BL, blokuje pristup
    if (blacklistedIPs.has(clientIP)) {
        console.warn(`🚨 Přístup zablokován pro IP: ${clientIP}`);
        return res.status(403).json({ error: "Vaše IP adresa byla zablokována." });
    }

    next()
}

export function addToBlacklist(ip) {
    if (!blacklistedIPs.has(ip)) {
        blacklistedIPs.add(ip);
        console.warn(`🧨 IP ${ip} byla přidána na blacklist!`);
        return true; // Vracie true pokud adresa byla pridana 
    }
    return false; // ❌ IP uz na blacklistu byla
}


