import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware pro správné nastavení odpovědi jako JSON
app.use(cors({
    origin: "http://127.0.0.1:5501", // ✅ Povolení pro tvůj frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // ✅ Povolení pro přihlášení
}))

// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});