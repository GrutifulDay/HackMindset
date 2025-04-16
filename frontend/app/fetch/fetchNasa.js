import { updateNasaData } from "./updateNasa.js";

console.log("✅ {fetchNasa.js} načten");

// 🔥 FETCH Z API SERVER.JS
export async function fetchNasaImage() {
    // 🛑 Pokud není potřeba aktualizovat, použijeme uložená data
    if (!(await updateNasaData())) {
        const storage = await new Promise((resolve) => {
            chrome.storage.local.get("nasaData", (result) => {
                resolve(result);
            });
        });
        return storage.nasaData;
    }

    console.log("🌍 Načítám nová data z API...");

    try {
        const response = await fetch("https://localhost:3000/api/nasa");
        if (!response.ok) throw new Error("❌ Chyba při načítání obrázku");

        const data = await response.json();
        console.log("🔍 Data z API:", data);

        // 📝 Uložíme data do `chrome.storage`
        await chrome.storage.local.set({ nasaData: data, lastFetch: Date.now() });
        return data;
    } catch (error) {
        console.error("⚠️ Chyba při načítání NASA dat:", error);
        return null; // Pokud API selže, vrátíme null
    }
}








