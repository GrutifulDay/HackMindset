// dotevn
import { PORT } from "./config.js"

// zaklad
import fs from "fs"
import https from "https"

// NPM knihovny 
import express from "express";
import helmet from "helmet"
import chalk from "chalk";
import { UAParser } from "ua-parser-js";


// Routes
import nasaRoutes from "./routes/nasaRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";
import storyRoutes from "./routes/storyRoutes.js"
import testDB from "./routes/test-db.js"

// Middleware
import limiterApi from "./middlewares/rateLimit.js";
import corsOptions from "./middlewares/corsConfig.js";
import botProtection from "./middlewares/botProtection.js";
import ipBlacklist from "./middlewares/ipBlacklist.js";
import speedLimiter from "./middlewares/slowDown.js";

// fce 
import { loadBlacklistFromDB } from "./middlewares/ipBlacklist.js";

// Databaze 
import connectDB from "./db/db.js"
import connectFrontendDB from "./db/connectFrontendDB.js";
import path from "path";

const app = express()
const __dirname = path.resolve() // pri pouziti ES modulů

// MongoDB
await connectDB()
await connectFrontendDB()

// Kontrola IP adres 
await loadBlacklistFromDB()

// Zabezpeceni
app.disable("x-powered-by") // Skrytí frameworku - express.js
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],         // povolit jen vlastni skriptove soubory
        "object-src": ["'none'"],          // zakazuje vkladane objekty
        "base-uri": ["'self'"],            // zakazuje menit zakl. URL pro relaticni odkazy
        "img-src": ["'self'", "https://apod.nasa.gov", "https://mars.nasa.gov", "https://images-assets.nasa.gov"] // NASA img
      }
    }
  })
) // Ochrana HTTP hlaviček


// Nasazeni middlewares
app.use(limiterApi)
app.use(corsOptions)
app.use(botProtection)
app.use(ipBlacklist)
app.use(speedLimiter)


// ✅ Načtení NASA router
app.use("/api", nasaRoutes)
app.use("/api", ipRoutes);
app.use("/api", storyRoutes)
app.use("/api", testDB)


// pridani statickych souboru 
app.use(express.static(path.join(__dirname, "frontend")))

// testovaci router
app.get("/api/test", (req, res) => {
    const userAgentString = req.get("User-Agent") || "neznámý"
    const parser = new UAParser(userAgentString)
    const result = parser.getResult()

    console.log("UAParser výstup:", result);

    res.json({
        message: "Server OK",
        originalUserAgent: userAgentString,
        parsed: result
    })

});

// nacitani certifikatu ze slozky cert
const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}

// ✅ Spuštění serveru
https.createServer(options, app).listen(PORT, () => {
    console.log(chalk.magenta.bold("✅ Server běží na: https://localhost"));
    console.log(`🛡️ HTTPS port: ${PORT}`);
})