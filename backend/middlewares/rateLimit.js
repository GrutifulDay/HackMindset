import rateLimit from "express-rate-limit"
import { addToBlacklist } from "./ipBlacklist.js"

// ❌
// Seznam IP adres, které chceme ignorovat (localhost)
// const ignoredIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"] // moje IP 

const limiterApi = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min - pozdeji zmenit
    max: 20, // max X pozadavku
    standardHeaders: true,
    legacyHeaders: false, // nepouziva zastarale hlavicky 
    handler: async (req, res) => {
        const ip = req.ip

        console.warn(`❌ Rate limit exceeded for IP: ${ip}`);

        await addToBlacklist(ip, "Překročil limit 20 požadavků za minutu")

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

