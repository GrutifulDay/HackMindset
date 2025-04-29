import express from "express";
import { UAParser } from "ua-parser-js";
import { addToBlacklist } from "../middlewares/ipBlacklist.js"; 
import { getStoryOfTheDay } from "../controllers/storyController.js"

const router = express.Router()


async function saveIPtoBlacklist(req, res, next) {
    const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP"
    const userAgentString = req.get("User-Agent") || "Neznámý"
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    const apiKey = req.headers["x-api-key"]
    const expectedKey = "fd982hf28HJKfd87gf9Jdf9823kjasd"; 

    if (apiKey !== expectedKey) {
        await addToBlacklist(userIP, "Zavolání /story-of-the-day routeru", {
            userAgent: userAgentString,
            browser: result.browser.name,
            os: result.os.name,
            deviceType: result.device.type
        });
        return res.status(403).json({ error: "Neplatný API klíč" })
    }

    next(); // pokud je klic OK, pokracuje
}


router.get("/story-of-the-day", saveIPtoBlacklist, getStoryOfTheDay)

export default router

