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
app.set("trust proxy", 1)

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
app.use(ipBlacklist)
app.use(speedLimiter)
app.use(limiterApi)
app.use(botProtection)
app.use(corsOptions)

app.use(express.json())

// ✅ Načtení NASA router
app.use("/api", nasaRoutes)
app.use("/api", storyRoutes)
app.use("/api", retroRoutes)
app.use("/api", profileRoutes)
app.use("/api",digitalRoutes)

// app.use("/api", ipRoutes)
// app.use("/api", testDB)

// pridani statickych souboru 
app.use(express.static(path.join(__dirname, "frontend")))

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

// nacitani certifikatu ze slozky cert
const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}

// ✅ Spuštění serveru
https.createServer(options, app).listen(PORT, () => {
    console.log(chalk.magenta.bold("✅ Server běží na: https://localhost"))
    console.log(`🛡️ HTTPS port: ${PORT}`)
})