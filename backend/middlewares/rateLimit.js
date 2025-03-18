// nastaveni omezeni pozadavku pri volani API 

import rateLimit from "express-rate-limit";

const limiterApi = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 pozadavku 
    message: "Příliš mnoho požadavků, zkuste to znovu za 15 minut.",
    standardHeaders: true, // Posílá RateLimit hlavičky (X-RateLimit-Limit, X-RateLimit-Remaining)
    legacyHeaders: false, // Nepoužívá zastaralé hlavičky (X-RateLimit-Reset)
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: "Příliš mnoho požadavků, zkuste to znovu za 15 minut." });
    },
    keyGenerator: (req) => req.ip, // muze se zmenit na id, kdyz by byla autentizace 
});

export default limiterApi;
