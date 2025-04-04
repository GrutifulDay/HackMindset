// dotevn
import { PORT } from "./config.js"

// zaklad
import fs from "fs"
import https from "https"

// NPM knihovny 
import express from "express";
import helmet from "helmet"
import chalk from "chalk";

// Routes
import nasaRoutes from "./routes/nasaRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";

// Middleware
import limiterApi from "./middlewares/rateLimit.js";
import corsOptions from "./middlewares/corsConfig.js";
import botProtection from "./middlewares/botProtection.js";
import ipBlacklist from "./middlewares/ipBlacklist.js";
import speedLimiter from "./middlewares/slowDown.js";

import connectDB from "./db.js"

const app = express();

await connectDB()

// Zabezpeceni
app.disable("x-powered-by"); // ✅ Skrytí frameworku - express.js
app.use(helmet()); // ✅ Ochrana HTTP hlaviček

// Nasazeni middlewares
app.use(limiterApi)
app.use(corsOptions)
app.use(botProtection)
app.use(ipBlacklist)
app.use(speedLimiter)


// vypnuti silenych vypisu 
// app.use((req, res, next) => {
//     if (process.env.NODE_ENV !== "production") {
//         console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     }
//     next();
// });


// test pripojeni db 
// import mongoose from "mongoose";
// app.get("/api/db-status", async (req, res) => {
//   const state = mongoose.connection.readyState;
//   const statusMap = ["❌ Disconnected", "✅ Connected", "🔄 Connecting", "⏳ Disconnecting"];
//   res.json({ status: statusMap[state], code: state });
// });


// testovaci router
app.get("/api/test", (req, res) => {
    res.json({ message: "Test OK" })
})

// ✅ Načtení NASA router
app.use("/api/nasa", nasaRoutes)
app.use("/api", ipRoutes);

// nacitani certifikatu ze slozky cert
const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}

// ✅ Spuštění serveru
https.createServer(options, app).listen(PORT, () => {
    console.log(chalk.magenta.bold("✅ Server běží na: https://localhost"));
    console.log("🛡️  HTTPS port: ${PORT}");
})