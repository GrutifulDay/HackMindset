import rateLimit from "express-rate-limit"
import { addToBlacklist } from "./ipBlacklist.js"

// ❌
// Seznam IP adres, které chceme ignorovat (localhost)
// const ignoredIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"] // moje IP 

const limiterApi = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 min - pozdeji zmenit
    max: 100, // max X pozadavku
    standardHeaders: true,
    legacyHeaders: false, // nepouziva zastarale hlavicky 
    handler: async (req, res) => {
        const ip = req.ip

        console.warn(`❌ Rate limit exceeded for IP: ${ip}`);

        await addToBlacklist(ip, "Překročil limit 100 požadavků za minutu")

        res.status(429).json({
        error: "Příliš mnoho požadavků – zpomal prosím."
        })

    },
    keyGenerator: (req) => req.ip,  // muze se zmenit na id, kdyz by byla autentizace 
    
    // ❌
    // 💡 DŮLEŽITÉ: Tohle řekne rate limiteru, ať IGNORUJE localhost
    // skip: (req) => {
    //     const ip = req.ip
    //     // return ignoredIPs.includes(ip) 
    // }
})

export default limiterApi

// import rateLimit from "express-rate-limit"
// import { addToBlacklist } from "./ipBlacklist.js"
// import fs from "fs"
// import path from "path"

// // Seznam ignorovaných IP (localhost apod.)
// const ignoredIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"]

// // Sledování opakovaných failů (paměť, může být i DB/Redis)
// const failedAttempts = new Map();
// const LOG_PATH = path.join(process.cwd(), "rate_limit.log");

// // Helper na logování
// function logIncident(ip, message) {
//     const line = `${new Date().toISOString()} [${ip}] ${message}\n`;
//     fs.appendFileSync(LOG_PATH, line);
// }

// // Hlavní handler
// const limiterApi = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minut
//     max: 100, // max 100 požadavků / 15 min
//     standardHeaders: true,
//     legacyHeaders: false,
//     skip: (req) => ignoredIPs.includes(req.ip),
//     keyGenerator: (req) => req.ip,
//     handler: async (req, res) => {
//         const ip = req.ip;
//         logIncident(ip, "RATE_LIMIT_EXCEEDED");
        
//         // Eviduj selhání za posledních 15 min
//         let entry = failedAttempts.get(ip) || [];
//         const now = Date.now();
//         entry = entry.filter(ts => now - ts < 15 * 60 * 1000);
//         entry.push(now);
//         failedAttempts.set(ip, entry);

//         // Zabanovat až po 3 selháních během 15 min
//         if (entry.length >= 3) {
//             logIncident(ip, "BLACKLISTED");
//             await addToBlacklist(ip, "3x překročení limitu za 15 minut");
//         }

//         res.status(429).json({
//             error: "Příliš mnoho požadavků – zpomal prosím."
//         });
//     }
// })

// export default limiterApi
