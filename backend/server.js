// dotevn
import { PORT } from "./config.js"

// zaklad
import fs from "fs"
import https from "https"
import { UAParser } from "ua-parser-js"

// NPM knihovny 
import express from "express"
import helmet from "helmet"
import chalk from "chalk"


// Routes
import nasaRoutes from "./routes/nasaRoutes.js"
import storyRoutes from "./routes/storyRoutes.js"
import retroRoutes from "./routes/retroRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import digitalRoutes from "./routes/digitalRoutes.js"
import untruthRoutes from "./routes/untruthRoutes.js"
import untruthLimitRoutes from "./routes/untruthLimit.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"

import secLogRoutes from "./routes/secLog.js"

// import ipRoutes from "./routes/ipRoutes.js"
// import testDB from "./routes/test-db.js"


// Middleware
import limiterApi from "./middlewares/rateLimit.js"
import corsOptions from "./middlewares/corsConfig.js"
import botProtection from "./middlewares/botProtection.js"
import ipBlacklist from "./middlewares/ipBlacklist.js"
import speedLimiter from "./middlewares/slowDown.js"

// Middleware - fce 
import { loadBlacklistFromDB } from "./middlewares/ipBlacklist.js"

// Databaze 
import connectDB from "./db/db.js"
import connectFrontendDB from "./db/connectFrontendDB.js"
import path from "path"

const app = express()
app.set("trust proxy", true); 
app.disable("etag");  

app.use(secLogRoutes)

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});
console.log("✅ Start server.js");

const startTime = new Date().toLocaleString('cs-CZ', {
  timeZone: 'Europe/Prague',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

console.log(chalk.magenta.bold(`💣 Server spuštěn: ${startTime}`));


const __dirname = path.resolve() // pri pouziti ES modulů

// MongoDB
await connectDB()
await connectFrontendDB()

// Kontrola IP adres 
await loadBlacklistFromDB()

// Zabezpeceni
app.disable("x-powered-by") // Skrytí frameworku - express.js
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
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


console.log("🛠️ DEBUG: Tento soubor se opravdu spustil!");

app.use("/_sec-log", express.json({ limit: "10kb", type: "application/json" }));
app.use(secLogRoutes); // tenhle router řeší POST /_sec-log

// Nasazeni middlewares
app.use(corsOptions);   // 1) preflight
app.use(ipBlacklist);   // 2) hned blokovat známé IP
app.use(botProtection); // 3) detekce botů/UA
app.use(speedLimiter);  // 4) zpomalení floodu
app.use(limiterApi);    // 5) tvrdý rate limit

app.use(express.json({ limit: "25kb" }))

// pokud by bylo potreba, jde nastavit pristenjsi limit jednotlive: 
// app.use("/api/feedbackForm", express.json({ limit: "4kb" }));

// ✅ Načtení NASA router
app.use("/api", nasaRoutes)
app.use("/api", storyRoutes)
app.use("/api", retroRoutes)
app.use("/api", profileRoutes)
app.use("/api", digitalRoutes)
app.use("/api", untruthRoutes)
app.use("/api", untruthLimitRoutes)
app.use("/api", feedbackRoutes)
// app.use("/api", secLogRoutes)


// app.use("/api", ipRoutes)
// app.use("/api", testDB)

app.get("/", (req, res) => {
  res.status(200).send("HackMindset backend is running");
});


app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

import mongoose from "mongoose";

// ✅ Healthcheck endpoint
app.get("/health", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // 0 = disconnected, 2 = connecting, 3 = disconnecting
      return res.status(503).json({ 
        status: "unhealthy", 
        detail: "MongoDB not connected" 
      });
    }

    const admin = mongoose.connection.db.admin();

    // Timeout ochrana – když se DB sekne
    const pingPromise = admin.ping();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Ping timeout")), 2000)
    );

    await Promise.race([pingPromise, timeout]);

    return res.status(200).json({ status: "ok" });

  } catch (err) {
    if (err.message.includes("timeout")) {
      return res.status(504).json({ 
        status: "timeout", 
        detail: "MongoDB did not respond in time" 
      });
    }

    return res.status(500).json({ 
      status: "error", 
      detail: err.message 
    });
  }
});


// testovaci router
app.get("/api/test", (req, res) => {
    const userAgentString = req.get("User-Agent") || "neznámý"
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    console.log("UAParser výstup:", result)

    res.json({
        message: "Server OK",
        originalUserAgent: userAgentString,
        parsed: result
    })

})

// pridani statickych souboru 
app.use(express.static(path.join(__dirname, "frontend")))


// nacitani certifikatu ze slozky cert
// const options = {
//     key: fs.readFileSync('./cert/key.pem'),
//     cert: fs.readFileSync('./cert/cert.pem'),
// }


// https.createServer(options, app).listen(PORT, "127.0.0.1", () => {
//   console.log(`✅ HTTPS server běží na https://127.0.0.1:${PORT}`);
// });

console.log(app._router.stack.map(r => r.route && r.route.path).filter(Boolean))

// ✅ Spuštění serveru
app.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Server běží na http://127.0.0.1:${PORT}`);
});







