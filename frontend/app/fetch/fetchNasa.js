import { updateSectionData } from "../utils/update/updateSectionData.js"
import { getJwtToken } from "../utils/auth/jwtToken.js"
import { API } from "../utils/config.js";

console.log("{fetchNasa.js} 📡 je načtený")

export async function fetchNasaImage() {
  console.log("{funkce fetchNasaImage} ✅ funguje");

  const token = await getJwtToken() 

  if (!token) {
    console.error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }

  const shouldUpdate = await updateSectionData("nasa")

  if (!shouldUpdate) {
    console.log("[nasa] ⏳ Data jsou aktuální – čtu z cache.");

    const { nasaData } = await new Promise((resolve) => {
      chrome.storage.local.get("nasaData", (result) => resolve(result))
    })

    return nasaData || null
  }

  try {
    const response = await fetch(API.nasa, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
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

