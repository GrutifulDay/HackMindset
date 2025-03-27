import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

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

app.disable("x-powered-by"); // ✅ Skrytí frameworku
app.use(helmet()); // ✅ Ochrana HTTP hlaviček


// Nasazeni middlewares
app.use(limiterApi)
app.use(corsOptions)
app.use(botProtection)
app.use(ipBlacklist)
app.use(speedLimiter)

app.get("/api/test", (req, res) => {
    res.json({ message: "Test OK" });
});


// ✅ Načtení routes
app.use("/api/nasa", nasaRoutes);


// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na: http://localhost:${PORT}`);
    console.log(`🛠️  Používá se port: ${process.env.PORT || 3000}`);
});
