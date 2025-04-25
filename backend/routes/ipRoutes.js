import express from "express";
import BlacklistedIP from "../models/BlacklistedIP.js";

const router = express.Router();

// ✅ Získání všech zablokovaných IP
router.get("/blacklist", async (req, res) => {
  try {
    const ips = await BlacklistedIP.find().sort({ date: -1 }) // od nejnovejsiho po nejstarsi 
    res.json(ips)
  } catch (err) {
    console.error("❌ Chyba při získávání blacklistu:", err.message);
    res.status(500).json({ error: "Chyba serveru" })
  }
});

export default router;


