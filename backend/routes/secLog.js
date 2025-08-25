import express from "express";
const router = express.Router();

// Malý parser a limit – jen pro tento router
router.use(express.json({ limit: "16kb", type: "application/json" }));

// Bezpečnostní brána: jen localhost + speciální hlavička
router.use((req, res, next) => {
  const ip = req.ip;
  const localhost = (ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1");
  if (!localhost) return res.status(403).json({ error: "Only localhost." });

  if (req.headers["x-from-openresty"] !== "1") {
    return res.status(403).json({ error: "Missing/invalid X-From-OpenResty header." });
  }
  next();
});

// POST /_sec-log – zatím jen potvrzení (202)
router.post("/_sec-log", (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Expected JSON object." });
  }
  // (Později: uložíme do DB. Teď jen rychlá odpověď, ať se snadno ladí cesta.)
  return res.status(202).json({ ok: true });
});

export default router;
