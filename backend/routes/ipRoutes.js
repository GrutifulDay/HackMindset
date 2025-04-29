import express from "express";
import { UAParser } from "ua-parser-js";
import BlacklistedIP from "../models/BlacklistedIP.js";
import { addToBlacklist } from "../middlewares/ipBlacklist.js"; 

const router = express.Router();

// ✅ Získání všech zablokovaných IP
router.get("/blacklist", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP";
  const userAgentString = req.get("User-Agent") || "Neznámý"
  const parser = new UAParser(userAgentString)
  const result = parser.getResult()

  await addToBlacklist(userIP, "Zavolání /blacklist routeru", {
    userAgent: userAgentString,
    browser: result.browser.name,
    os: result.os.name,
    deviceType: result.device.type
  })

  try {
    const ips = await BlacklistedIP.find().sort({ date: -1 }) // od nejnovejsiho po nejstarsi 
    res.json(ips)
  } catch (err) {
    console.error("❌ Chyba při získávání blacklistu:", err.message);
    res.status(500).json({ error: "Chyba serveru" })
  }
});

export default router;


