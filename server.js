import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// API Routes


// ✅ Middleware pro správné nastavení odpovědi jako JSON 
app.use(cors({
    origin: ["http://127.0.0.1:5501", "chrome-extension://nnmdmkojeohnoogpmmiopepdgjkopbbj"], // Opravit na ID tvého rozšíření
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

//app.use(cors({ origin: "*" }));

// app.get("/api/nasa", async (req, res) => {
//     try {
//         const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`;
//         const response = await fetch(apiUrlNasa);

//         if (!response.ok) {
//             throw new Error(`❌ Chyba při načítání dat ze serveru, status: ${response.status}`);
//         }

//         const data = await response.json();

//         // 🖼 Obrázek
//         if (data.media_type === "image") {
//             return res.json({ type: "image", url: data.url, explanation: data.explanation });
//         }

//         // 🎥 Video
//         if (data.media_type === "video") {
//             return res.json({ type: "video", url: data.url, explanation: data.explanation });
//         }

//         // 🚨 Pokud je odpověď jiná, vrátíme chybu
//         res.status(400).json({ error: "Neznámý formát NASA média." });

//     } catch (error) {
//         console.error("❌ Chyba při volání NASA API:", error.message);
//         res.status(500).json({ error: "Interní chyba serveru." });
//     }
// });


app.get("/api/nasa", async (req, res) => {
    try {
        const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`;
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
        console.error("Chyba na serveru:", error);
        res.status(500).json({ error: "Chyba na serveru" });
    }
});

// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});