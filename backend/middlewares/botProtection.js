import { addToBlacklist } from "./ipBlacklist.js";
import { UAParser } from "ua-parser-js"

// ✅ Pomocná funkce pro správné získání IP adresy
function getUserIP(req) {
    return (
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||    // vezme prvni IP
        req.socket?.remoteAddress ||    // pokud neni, vezne IP ze sitoveho pripojeni
        req.connection?.remoteAddress ||    // starsi zpusob - naprimo ze sitoveho spojeni
        "neznámá IP"    // pokud na nic neprisel
    )
}

export default function botProtection(req, res, next) {
    const userAgentString = req.get("User-Agent");
    const userIP = getUserIP(req); // 

    // ✅ Výjimka pro Postman
    if (userAgentString && userAgentString.includes("Postman")) {
        console.log("🧪 Postman detekován – povolen.");
        return next();
    }

    // ⛔️ Blokování bez user-agent
    if (!userAgentString) {
        console.warn(`🚨 Bot detekován: IP ${userIP} přidána na blacklist.`);
        addToBlacklist(userIP)
        return res.status(403).json({ error: "Přístup zamítnut." })
    }

    // Analýza pomocí UAParser
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    const browserName = result.browser.name || "Neznámý" // prohlizec
    const deviceType = result.device.type || "Neznámý"  // zařízení
    const osName = result.os.name || "neznámý"  // operacni system

    // ⚠️ Podezřelý user-agent
    if (browserName === "Other" || browserName === undefined) {
        console.warn(`🚨 Podezřelý bot detekován (${deviceType}, ${osName}) – IP ${userIP}`);
        addToBlacklist(userIP)
        return res.status(403).json({ error: "Přístup zamítnut."})
    }

    next() // ✅ vše ok
}





// import { addToBlacklist } from "./ipBlacklist.js"; 
// import useragent from "useragent";


// export default function botProtection(req, res, next) {
//     const userAgentString = req.get("User-Agent")

//     //blokovani botu bez User-Agent
//     if (!userAgentString) {
//         console.warn(`🚨 Bot detekován: IP ${req.ip} přidána na blacklist.`)
//         addToBlacklist(req.ip); // ✅ Přidání IP na blacklist
//         return res.status(403).json({ error: "Přístup zamítnut." })
//     }

//     //rozpoznani fake prohlizece
//     const agent = useragent.parse(userAgentString)
//     if (agent.family === "Other") {
//         console.warn(`🚨 Podezřelý bot detekován: IP ${req.ip}`)
//         addToBlacklist(req.ip); // ✅ Přidání podezřelé IP na blacklist
//         return res.status(403).json({ error: "Přístup zamítnut." })
//     }

//     next();
// }



