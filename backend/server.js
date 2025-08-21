// dotevn
import { PORT } from "./config.js"

// zaklad
// import fs from "fs"
// import https from "https"
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
app.set("trust proxy", 1)  // duveruje proxy v retezci jako NGINX
app.disable("etag");  

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
  helmet({
    contentSecurityPolicy: {
      useDefaults: false, // vypni defaulty, ať máš kontrolu
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
    }
  })
)

console.log("🛠️ DEBUG: Tento soubor se opravdu spustil!");

// Nasazeni middlewares
app.use(ipBlacklist)
app.use(speedLimiter)
app.use(limiterApi)
app.use(botProtection)
app.use(corsOptions)

app.use(express.json({ limit: "10kb" }))


// ✅ Načtení NASA router
app.use("/api", nasaRoutes)
app.use("/api", storyRoutes)
app.use("/api", retroRoutes)
app.use("/api", profileRoutes)
app.use("/api", digitalRoutes)
app.use("/api", untruthRoutes)
app.use("/api", untruthLimitRoutes)
app.use("/api", feedbackRoutes)

// app.use("/api", ipRoutes)
// app.use("/api", testDB)

app.get("/", (req, res) => {
  res.status(200).send("HackMindset backend is running");
});


app.get("/ping", (req, res) => {
  res.status(200).send("pong");
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

console.log(app._router.stack.map(r => r.route && r.route.path).filter(Boolean))

// ✅ Spuštění serveru
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server běží na http://0.0.0.0:${PORT}`);
});

console.log(`✅ Spouštím na portu ${PORT}`);





