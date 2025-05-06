import { UAParser } from "ua-parser-js"
import { addToBlacklist, isBlacklisted } from "./ipBlacklist.js"
import { TOKEN_IP_CITY } from "../config.js"

const getCityByIP = async (ip) => {
    const realIP =
      ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1"
        ? "8.8.8.8" // Google DNS – veřejná IP pro test
        : ip;
  
    const token = TOKEN_IP_CITY
  
    try {
      const response = await fetch(`https://ipinfo.io/${realIP}/json?token=${token}`);
      const data = await response.json();
      console.log("🔍 Data z ipinfo.io:", data);
      return data.city || "Neznámé město";
    } catch (err) {
      console.error("❌ Chyba při získávání města:", err.message);
      return "Neznámé město";
    }
  };

export function validateApiKey(expectedKey, routeDescription) {
    console.log("validateApiKey funguje");
    return async function (req, res, next) {
        const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP";
        const userAgentString = req.get("User-Agent") || "Neznámý";
        const parser = new UAParser(userAgentString);
        const result = parser.getResult();

        const city = await getCityByIP(userIP);
        console.log("🌍 Město, které vrací getCityByIP:", city); 

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
                city: city || "Neznámý",
            })
            return res.status(403).json({ error: "Neplatný API klíč" })
        }

        next()
    }
}

