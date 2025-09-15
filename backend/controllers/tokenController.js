import jwt from "jsonwebtoken";
import { CHROME_EXTENSION_ALL_URL, JWT_SECRET } from "../config.js";

export function getToken(req, res) {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const userAgent = req.get("User-Agent") || "";

  // 🛡️ overeni, ze pozadavek je z rozsireni
  const isFromExtension =
    origin.includes(CHROME_EXTENSION_ALL_URL) ||
    referer.includes(CHROME_EXTENSION_ALL_URL);

  if (!isFromExtension || !userAgent.includes("Chrome")) {
    return res.status(403).json({ error: "Nepovolený přístup k tokenu" });
  }

  // 📦 Payload tokenu
  const payload = {
    extId: CHROME_EXTENSION_ALL_URL, // overeni, ze je jen pro moje rozsireni
  };

  // 🔐 vytvoreni JWT 
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30s",
  });

  return res.json({ token });
}
