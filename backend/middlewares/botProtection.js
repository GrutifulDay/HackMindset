import { addToBlacklist } from "./ipBlacklist.js"; 
import useragent from "useragent";

export default function botProtection(req, res, next) {
    const userAgentString = req.get("User-Agent");

    // ✅ Výjimka pro Postman
    if (userAgentString && userAgentString.includes("Postman")) {
        console.log("🧪 Postman detekován – povolen.");
        return next();
    }

    // ⛔️ Blokování botů bez User-Agent
    if (!userAgentString) {
        console.warn(`🚨 Bot detekován: IP ${req.ip} přidána na blacklist.`);
        addToBlacklist(req.ip);
        return res.status(403).json({ error: "Přístup zamítnut." });
    }

    // ⚠️ Podezřelý agent
    const agent = useragent.parse(userAgentString);
    if (agent.family === "Other") {
        console.warn(`🚨 Podezřelý bot detekován: IP ${req.ip}`);
        addToBlacklist(req.ip);
        return res.status(403).json({ error: "Přístup zamítnut." });
    }

    // ✅ Vše v pořádku
    next();
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



