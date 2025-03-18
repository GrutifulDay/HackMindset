import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import express from "express";

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



// NASA fetch API > .env
app.get("/api/nasa", async (req, res) => {
    try {
        if (!process.env.FETCH_API_NASA || !process.env.API_KEY_NASA) {
            throw new Error("❌ Chybí API klíč nebo URL NASA v .env souboru.")
        }

        const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`
        const response = await fetch(apiUrlNasa)

        if (!response.ok) {
            throw new Error(`❌ Chyba při načítání dat ze serveru, status: ${response.status}`)
        } 

        const data = await response.json()

        if (data.media_type === "image") {
            return res.json({ type: "image", url: data.url, explanation: data.explanation })
        } else {
            return res.json({ type: "text", url: "", explanation: "Dnes je video 🎥. Klikni na odkaz!" })
        }

    } catch (error) {
        console.error("❌ Chyba na serveru:", error)
        res.status(500).json({ error: "Chyba na serveru" })
    }
})


// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na: http://localhost:${PORT}`);
    console.log(`🛠️  Používá se port: ${process.env.PORT || 3000}`);
});
