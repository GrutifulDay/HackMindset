import slowDown from "express-slow-down"

const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 min POZDEJI ZMENIT
  delayAfter: 100, // X max pozadavku 
  delayMs: () => 300, // Každý další request zpomalíme o Xms
  message: "Příliš mnoho požadavků – zpomalte."
});

function logSlowRequests(req, res, next) {
    const used = req.slowDown?.current || 0
    const limit = req.slowDown?.limit || 0
  
    if (used > limit) {
      console.warn(`🐌 IP ${req.ip} je zpomalena: ${used}/${limit}`);
      res.setHeader("X-Slowed-Down", "true")
    }
  
    next()
  }
  
export default [speedLimiter, logSlowRequests]
