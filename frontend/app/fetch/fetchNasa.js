import { updateSectionData } from "../../utils/dom/updateSectionData.js"

console.log("{fetchNasa.js} 📡 je načtený")

export async function fetchNasaImage() {
  console.log("{funkce fetchNasaImage} ✅ funguje");

  const shouldUpdate = await updateSectionData("nasa")

  if (!shouldUpdate) {
    console.log("[nasa] ⏳ Data jsou aktuální – čtu z cache.");

    const { nasaData } = await new Promise((resolve) => {
      chrome.storage.local.get("nasaData", (result) => resolve(result))
    })

    return nasaData || null
  }

  try {
    const response = await fetch("https://localhost:3000/api/nasa", {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    const data = await response.json()

    await new Promise((resolve) => {
      chrome.storage.local.set(
        {
          nasaData: data,
          nasa_lastFetch: Date.now(),
        },
        resolve
      )
    })

    console.log("[nasa] ✅ Nová data uložena");
    return data
  } catch (error) {
    console.error("❌ fetchNasaImage error", error);
    return null
  }
}

