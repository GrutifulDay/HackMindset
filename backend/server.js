import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import fs from "fs"
import https from "https"
import express from "express";
import helmet from "helmet"

import nasaRoutes from "./routes/nasa.js";

import limiterApi from "./middlewares/rateLimit.js";
import corsOptions from "./middlewares/corsConfig.js";
import botProtection from "./middlewares/botProtection.js";
import ipBlacklist from "./middlewares/ipBlacklist.js";
import speedLimiter from "./middlewares/slowDown.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Zabezpeceni
app.disable("x-powered-by"); // ✅ Skrytí frameworku - express.js
app.use(helmet()); // ✅ Ochrana HTTP hlaviček

// Nasazeni middlewares
app.use(limiterApi)
app.use(corsOptions)
app.use(botProtection)
app.use(ipBlacklist)
app.use(speedLimiter)


// testovaci router
app.get("/api/test", (req, res) => {
    res.json({ message: "Test OK" })
})


// ✅ Načtení NASA router
app.use("/api/nasa", nasaRoutes)


// nacitani certifikatu ze slozky cert
const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}

// ✅ Spuštění serveru
https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Server běží na: https://localhost`);
    console.log(`🛡️  HTTPS port: ${PORT}`);
})