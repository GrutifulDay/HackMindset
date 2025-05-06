import { updateNasaData } from "./updateNasa.js";

console.log("{fetchNasa.js} 📡 je načtený");


// 🔥 FETCH Z API SERVER.JS
export async function fetchNasaImage() {
    console.log("{funkce fetchNasaImage} ✅ funguje")


    // 🛑 Pokud neni potreba aktualizace, pouzije ulozena data 
    if (!(await updateNasaData())) {
        const storage = await new Promise((resolve) => {
            chrome.storage.local.get("nasaData", (result) => {
                resolve(result)
            });
        });
        return storage.nasaData
    }

    console.log("🌍 Načítám nová data z API...");

    try {
        const response = await fetch("https://localhost:3000/api/nasa")
        if (!response.ok) throw new Error("❌ Chyba při načítání obrázku")

        const data = await response.json()
        console.log("🔍 Data z API:", data);

        // 📝 Ulozi se data do `chrome.storage`
        await chrome.storage.local.set({ nasaData: data, lastFetch: Date.now() })
        return data
    } catch (error) {
        console.error("❌ Chyba při načítání NASA dat:", error);
        return null; // Vrati se null pokud selze 
    }
}







