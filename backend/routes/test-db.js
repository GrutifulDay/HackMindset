import express from "express";
import { UAParser } from "ua-parser-js";
import { addToBlacklist } from "../middlewares/ipBlacklist.js";

const router = express.Router();

router.get("/test-db", (req, res) => {
  const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP";
  const userAgentString = req.get("User-Agent") || "Neznámý";
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  addToBlacklist(userIP, "Test logování přes UAParser", {
    userAgent: userAgentString,
    browser: result.browser.name,
    os: result.os.name,
    deviceType: result.device.type
  });

  res.json({
    message: "Uloženo do DB pro test",
    ip: userIP,
    userAgent: userAgentString,
    parsed: result
  });
});

export default router;
