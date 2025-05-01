import express from "express";
import { UAParser } from "ua-parser-js";
import { addToBlacklist } from "../middlewares/ipBlacklist.js"; 
import { getRetroMachine } from "../controllers/retroControllers.js"

const router = express.Router()


async function saveIPtoBlacklist(req, res, next) {
    const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP"
    const userAgentString = req.get("User-Agent") || "Neznámý"
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    const apiKey = req.headers["x-api-key"]
    const expectedKey = "m7m3XPVh7KMf9JkoUvXsHnGhP7av6X"; 

    if (apiKey !== expectedKey) {
        await addToBlacklist(userIP, "Zavolání /retro-machine routeru", {
            userAgent: userAgentString,
            browser: result.browser.name,
            os: result.os.name,
            deviceType: result.device.type
        });
        return res.status(403).json({ error: "Neplatný API klíč" })
    }

    next(); // pokud je klic OK, pokracuje
}

console.log("{retroRoutes.js} pripojeno");

router.get("/retro-machine", saveIPtoBlacklist, getRetroMachine)

export default router