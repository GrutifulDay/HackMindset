import express from "express";
import { getToken } from "../controllers/tokenController.js";
import { getCityByIP } from "../utils/getCityByIP.js";
import { addToBlacklist } from "../middlewares/ipBlacklist.js";
import { CHROME_EXTENSION_ALL_URL, HACK_MINDSET } from "../config.js";

const router = express.Router();

router.get("/get-token", async (req, res) => {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const userAgent = req.get("User-Agent") || "";
  const extSecret = req.headers["x-hackmindset"]; // hodnota z hlavičky
  const userIP =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "neznámá IP";

  const isFromExtension =
    (origin && origin.includes(CHROME_EXTENSION_ALL_URL)) ||
    (referer && referer.includes(CHROME_EXTENSION_ALL_URL)) ||
    (!origin && !referer);

  const isLikelyChrome =
    userAgent.includes("Chrome") && !userAgent.includes("Postman");

    console.log("DEBUG HEADERS:", req.headers);


  // ✅ Ověření reálného secretu z env
  if (extSecret !== HACK_MINDSET) {
    const city = await getCityByIP(userIP);
    await addToBlacklist(userIP, "Pokus o získání tokenu", { userAgent, city });
    return res.status(403).json({ error: "Nepovolený přístup k tokenu" });
  }

  if (!isFromExtension || !isLikelyChrome) {
    const city = await getCityByIP(userIP);
    await addToBlacklist(userIP, "Pokus o získání tokenu", { userAgent, city });
    return res.status(403).json({ error: "Nepovolený přístup k tokenu" });
  }  

  return getToken(req, res);
});

export default router;


