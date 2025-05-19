import { updateNasaData } from "./updateNasa.js"

console.log("{fetchNasa.js} 📡 je načtený")

export async function fetchNasaImage() {
  console.log("{funkce fetchNasaImage} ✅ funguje")

  // Pokud neni potreba aktualizace, pouzije ulozena data
  if (!(await updateNasaData())) {
    const storage = await new Promise((resolve) => {
      chrome.storage.local.get("nasaData", (result) => {
        resolve(result)
      })
    })
    return storage.nasaData
  }

  console.log("🌍 Načítám nová data z API...");

  try {
    const response = await fetch("https://localhost:3000/api/nasa", {
      method: "GET",
      mode: "cors",
      headers: {
        // "x-extension-auth": "HACK_EXTENSION"
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    if (!response.ok) throw new Error("❌ Chyba při načítání obrázku")

    const data = await response.json()
    console.log("🔍 Data z API:", data);

    // ulozi se data do chrome.storage
    await chrome.storage.local.set({ nasaData: data, lastFetch: Date.now() })
    return data
  } catch (error) {
    console.error("❌ Chyba při načítání NASA dat:", error);
    return null 
  }
}
