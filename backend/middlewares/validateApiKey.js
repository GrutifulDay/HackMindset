import { UAParser } from "ua-parser-js";
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js";

export function validateApiKey(expectedKey, routeDescription) {
    console.log("validateApiKey funguje");
    return async function (req, res, next) {
        const userIP =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            "neznámá IP"

        const userAgentString = req.get("User-Agent") || "Neznámý"
        const parser = new UAParser(userAgentString)
        const result = parser.getResult()

        // Kontrola zda je na blacklistu 
        const isBlocked = await isBlacklisted(userIP)
        if (isBlocked) {
            return res.status(403).json({ error: "Přístup zamítnut. Vaše IP je na blacklistu." })
        }

        // kontrola APi klice 
        const apiKey = req.headers["x-api-key"]
        if (apiKey !== expectedKey) {
            await addToBlacklist(userIP, routeDescription, {
                userAgent: userAgentString,
                browser: result.browser?.name || "Neznámý",
                os: result.os?.name || "Neznámý",
                deviceType: result.device?.type || "Neznámý",
            })
            return res.status(403).json({ error: "Neplatný API klíč" })
        }

        next()
    }
}

