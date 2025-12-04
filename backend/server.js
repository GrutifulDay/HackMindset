// dotevn
import { PORT } from "./config.js"
console.log("ENV:", process.env.NODE_ENV);
console.log("DEBUG:", process.env.DEBUG);

// node token = util
import util from "util";
global.util = util;

import { debug, info, warn, error } from "./utils/logger.js";

// zaklad
import fs from "fs"

// lokalni testovani 
import https from "https"
import { UAParser } from "ua-parser-js"

// NPM knihovny 
import express from "express"
import helmet from "helmet"

// Routes
import nasaRoutes from "./routes/nasaRoutes.js"
import storyRoutes from "./routes/storyRoutes.js"
import retroRoutes from "./routes/retroRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import digitalRoutes from "./routes/digitalRoutes.js"
import untruthRoutes from "./routes/untruthRoutes.js"
import untruthLimitRoutes from "./routes/untruthLimit.js"
// import feedbackRoutes from "./routes/feedbackRoutes.js"
import secLogRoutes from "./routes/secLog.js"
import tokenRoutes from "./routes/tokenRoutes.js"

// Middleware
import limiterApi from "./middlewares/rateLimit.js"
import corsOptions from "./middlewares/corsConfig.js"
import botProtection from "./middlewares/botProtection.js"
import ipBlocker, { loadBlacklistFromDB } from "./middlewares/ipBlacklist.js"
import speedLimiter from "./middlewares/slowDown.js"
import captureHeaders from "./middlewares/captureHeaders.js";
// import detectSecretLeak from "./middlewares/detectSecretLeak.js";

// Utils 
import { startDailyCron } from "./utils/cron/dailyRefresh.js"
//import { startWatchForIPChanges } from "./utils/watch/startWatchForIPChanges.js"

// Databaze 
import connectDB from "./db/db.js"
import connectFrontendDB from "./db/connectFrontendDB.js"
import path from "path"

const app = express()
app.set("trust proxy", 1); 
// app.set("trust proxy", false); // true = proxy / false = vyvoj 

app.disable("etag")
app.disable("x-powered-by")

// ⚠️ Upozornění na dev režim
if (process.env.NODE_ENV !== "production") {
  debug("⚠️ Běžíš v development režimu – CSP a rate limity nejsou aktivní.");
}

// Request log (lehký)
app.use((req, res, next) => {
  debug(`➡️  ${req.method} ${req.url}`);
  next();
});

// start cas serveru 
const startTime = new Date().toLocaleString("cs-CZ", {
  timeZone: "Europe/Prague",
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})
info(`💣 Server spuštěn: ${startTime}`);

const __dirname = path.resolve() // pri pouziti ES modulů

// MongoDB
await connectDB();
await connectFrontendDB();

// Kontrola IP adres 
await loadBlacklistFromDB();

// refresh google extension po pridani ip do db
startDailyCron();
// startWatchForIPChanges();

// Helmet – CSP -> povoleni jen pro muj server (img, url, css atd.)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],    // vychozi zdroj pro obsah nacitani
      "script-src": ["'self'"],     // js scripty odkud
      "style-src": ["'self'", "'unsafe-inline'"], // ✅ povolí tvé i inline CSS
      "font-src": ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"], // ✅ povolí fonty
      "img-src": [
        "'self'",
        "https://apod.nasa.gov",
        "https://mars.nasa.gov",
        "https://images-assets.nasa.gov"
      ],
      "connect-src": ["'self'", "https://api.nasa.gov"],
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "frame-ancestors": ["'none'"]
    }
  })
);

// Základní health endpointy
app.get("/ping", (_req, res) => {
  res.status(200).send("pong")
})

app.get("/health", async (_req, res) => {
  try {
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    if (err.message.includes("timeout")) {
      warn("⏱️ Mongo ping timeout");
      return res.status(504).json({ status: "timeout", detail: "MongoDB did not respond in time" });
    }
    error("💥 /health error:", err.message);
    return res.status(500).json({ status: "error", detail: err.message });
  }
});

// detekce uniklych hesel
// app.use(detectSecretLeak({
//   blockOnLeak: true,          // blokuje pozadavek
//   blacklistOnLeak: true       // prida IP na blacklist
// }));

// ─────────────────────────────────────────────────────────────
// Interní servisní router pro /_sec-log
// (Uvnitř má vlastní pre-auth + JSON parser; tady nic dalšího nedávej.)
// ─────────────────────────────────────────────────────────────
app.use(secLogRoutes)

// Vary: Origin – kvůli CORS cache
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// 🔥 CORS – MUSÍ být před ipBlocker/botProtection
app.use(corsOptions);

// JSON parser (může být až za CORS)
app.use(express.json({ limit: "25kb" }));

// Otevřený test endpoint (bez ochranných middleware)
app.get("/api/test-open", (req, res) => {
  res.status(200).json({
    ok: true,
    ip: req.ip,
    ua: req.get("User-Agent")
  });
});

// Hlavičky a logování (jen jednou)
app.use(captureHeaders({
  notifyOn: (req) => {
    const ua = (req.get("User-Agent") || "").toLowerCase();
    const hasPostman = !!req.headers["postman-token"];
    const isPostmanUA = ua.includes("postman");
    return hasPostman || isPostmanUA;
  },
  notifyReason: "Client using Postman / test tool"
}));

// globalni Middleware – pořadí je důležité
app.use(ipBlocker);       // blokuje známé útočníky
app.use(botProtection);   // detekce botů / UA
app.use(speedLimiter);    // soft limit
app.use(limiterApi);      // tvrdý rate limit

// routes
app.use("/api", tokenRoutes);
app.use("/api", nasaRoutes)
app.use("/api", storyRoutes)
app.use("/api", retroRoutes)
app.use("/api", profileRoutes)
app.use("/api", digitalRoutes)
app.use("/api", untruthRoutes)
app.use("/api", untruthLimitRoutes)
// app.use("/api", feedbackRoutes)

// testovací router
// app.get("/api/test", (req, res) => {
//   const userAgentString = req.get("User-Agent") || "neznámý"
//   const parser = new UAParser(userAgentString)
//   const result = parser.getResult()
//   debug("UAParser výstup:", result)
//   res.json({ message: "Server OK", originalUserAgent: userAgentString, parsed: result })
// })

// Statické soubory
app.use(express.static(path.join(__dirname, "frontend")))

// Debug výpis registrovaných cest
try {
  const routes = app._router?.stack?.map(r => r?.route?.path).filter(Boolean)
  if (routes?.length) debug(routes)
} catch { /* ignore */ }

// ✅ Spuštění serveru
// app.listen(PORT, "127.0.0.1", () => {
//   info(`✅ Server běží na http://127.0.0.1:${PORT}`);
// });

// pro lokalni testovani 
const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
}

https.createServer(options, app).listen(PORT, "127.0.0.1", () => {
  debug(`✅ HTTPS server běží na https://127.0.0.1:${PORT}`);
});
