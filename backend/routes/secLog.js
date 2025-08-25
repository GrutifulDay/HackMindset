import express from "express";
import { saveSecurityLog } from "../services/securityLogService.js"; // 👈 DOPLNIT

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

  saveSecurityLog({
    src: "openresty",
    kind: req.body.kind,
    ip:   req.body.ip,
    method: req.body.method,
    host:  req.body.host,
    path:  req.body.path,
    status:req.body.status,
    ua:    req.body.ua,
    ref:   req.body.ref,
    rule:  req.body.rule,
    note:  req.body.note,
    raw:   req.body.raw,
  }).catch(err => console.error("sec-log save error:", err.message));

  return res.status(202).json({ ok: true });
});

export default router;
