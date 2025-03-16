import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🛠 Získání absolutní cesty k `backend/`
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Načtení `.env` souboru z `backend/`
dotenv.config({ path: path.join(__dirname, ".env") });

// Ověření, že proměnné jsou správně načtené
console.log("🔍 FETCH_API_NASA:", process.env.FETCH_API_NASA);
console.log("🔍 API_KEY_NASA:", process.env.API_KEY_NASA);

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware pro správné nastavení odpovědi jako JSON 
app.use(cors({
    origin: ["http://127.0.0.1:5501", "chrome-extension://nnmdmkojeohnoogpmmiopepdgjkopbbj"], // Opravit na ID tvého rozšíření
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

// 🌍 NASA fetch API > .env
app.get("/api/nasa", async (req, res) => {
    try {
        const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`;
        console.log("🌍 Fetching from:", apiUrlNasa);

        const response = await fetch(apiUrlNasa);

        if (!response.ok) {
            throw new Error(`Chyba při načítání FETCH dat ze serveru, status: ${response.status}`);
        } 

        const data = await response.json();

        if (data.media_type === "image") {
            return res.json({ type: "image", url: data.url, explanation: data.explanation });
        } else {
            return res.json({ type: "text", url: "", explanation: "Dnes je video 🎥. Klikni na odkaz!" });
        }

    } catch (error) {
        console.error("❌ Chyba na serveru:", error);
        res.status(500).json({ error: "Chyba na serveru" });
    }
});

// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
