import express from "express";

const router = express.Router();

// ✅ NASA fetch API
router.get("/", async (req, res) => {
    try {
        if (!process.env.FETCH_API_NASA || !process.env.API_KEY_NASA) {
            throw new Error("❌ Chybí API klíč nebo URL NASA v .env souboru.");
        }

        const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`;
        const response = await fetch(apiUrlNasa);

        if (!response.ok) {
            throw new Error(`❌ Chyba při načítání dat ze serveru, status: ${response.status}`);
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

export default router;


// // NASA fetch API > .env
// app.get("/api/nasa", async (req, res) => {
//     try {
//         if (!process.env.FETCH_API_NASA || !process.env.API_KEY_NASA) {
//             throw new Error("❌ Chybí API klíč nebo URL NASA v .env souboru.")
//         }

//         const apiUrlNasa = `${process.env.FETCH_API_NASA}${process.env.API_KEY_NASA}`
//         const response = await fetch(apiUrlNasa)

//         if (!response.ok) {
//             throw new Error(`❌ Chyba při načítání dat ze serveru, status: ${response.status}`)
//         } 

//         const data = await response.json()

//         if (data.media_type === "image") {
//             return res.json({ type: "image", url: data.url, explanation: data.explanation })
//         } else {
//             return res.json({ type: "text", url: "", explanation: "Dnes je video 🎥. Klikni na odkaz!" })
//         }

//     } catch (error) {
//         console.error("❌ Chyba na serveru:", error)
//         res.status(500).json({ error: "Chyba na serveru" })
//     }
// })