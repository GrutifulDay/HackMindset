import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import express from "express";

import nasaRoutes from "./routes/nasa.js";

import limiterApi from "./middlewares/rateLimit.js";
import corsOptions from "./middlewares/corsConfig.js";
import botProtection from "./middlewares/botProtection.js";
import ipBlocker from "./middlewares/ipBlacklist.js";
import speedLimiter from "./middlewares/slowDown.js";


const app = express();
const PORT = process.env.PORT || 3000;


// Nasazeni middlewares
app.use(limiterApi)
app.use(corsOptions)
app.use(botProtection)
app.use(ipBlocker)
app.use(speedLimiter)

// ✅ Načtení rout
app.use("/api/nasa", nasaRoutes);


// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na: http://localhost:${PORT}`);
    console.log(`🛠️  Používá se port: ${process.env.PORT || 3000}`);
});
