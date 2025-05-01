import { UAParser } from "ua-parser-js"
import { addToBlacklist } from "./ipBlacklist.js"

export function validateApiKey(expectedKey, routeDescription) {
    return async function (req, res, next) {
        const userIP =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            "neznámá IP"

        const userAgentString = req.get("User-Agent") || "Neznámý"
        const parser = new UAParser(userAgentString)
        const result = parser.getResult()

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
