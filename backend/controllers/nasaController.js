import { FETCH_API_NASA, API_KEY_NASA } from "../config.js"

export async function fetchNasaImage(req, res) {
    try {
        if (!FETCH_API_NASA || !API_KEY_NASA) {
            throw new Error("❌ Chybí API klíč nebo URL NASA v .env souboru.")
        }

        const apiUrlNasa = `${FETCH_API_NASA}${API_KEY_NASA}`
        const response = await fetch(apiUrlNasa)

        if (!response.ok) {
            throw new Error(`❌ Chyba při načítání dat ze serveru, status: ${response.status}`)
        }

        const data = await response.json()

        if (data.media_type === "image") {
            return res.json({ type: "image", url: data.url, explanation: data.explanation })
        } else {
            return res.json({ type: "video", url: data.url, explanation: `Dnes je video 🎥, klikni na odkaz: "Chceš vědět víc?"` })
        }

    } catch (error) {
        console.error("❌ Chyba na serveru:", error);
        res.status(500).json({ error: "Chyba na serveru" })
    }
}
