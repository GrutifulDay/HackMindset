import { updateSectionData } from "../utils/update/updateSectionData.js";
import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js";

console.log("{fetchNasa.js} 📡 je načtený");

export async function fetchNasaImage() {
  console.log("{funkce fetchNasaImage} ✅ funguje");

  const token = await getJwtToken();

  if (!token) {
    console.error("❌ Chybí JWT token fetchNasaImage – fetch se neprovede.");
    return { 
      error: true,
      message: "Chybí JWT token – NASA sekce se nenačte."
    };
  }

  const shouldUpdate = await updateSectionData("nasa");
  if (!shouldUpdate) {
    console.log("[nasa] ⏳ Data jsou aktuální – čtu z cache.");

    const { nasaData } = await new Promise((resolve) => {
      chrome.storage.local.get("nasaData", (result) => resolve(result));
    });

    if (nasaData && nasaData.url) return nasaData;
    console.warn("[nasa] ⚠️ Cache je prázdná nebo neobsahuje URL – načítám znovu.");
  }

  try {
    console.log("JWT token:", token);

    const response = await fetch(API.nasa, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn(`⚠️ fetchNasaImage: Server vrátil ${response.status}`);
      console.warn(`🔹 Response text: ${text}`);

      const { nasaData } = await new Promise((resolve) => {
        chrome.storage.local.get("nasaData", (result) => resolve(result));
      });
      if (nasaData) {
        console.warn("[nasa] Používám starší data z cache (server error).");
        return nasaData;
      }
      return { 
        error: true,
        message: "NASA API nedostupné a žádná cache neexistuje."
      };
    }

    const data = await response.json();

    // overeni dat z backendu
    if (!data || !data.url) {
      console.warn("⚠️ fetchNasaImage: Data z backendu neobsahují URL");
      return { 
        error: true,
        message: "NASA data nejsou platná – backend nevrátil obrázek."
      };
    }

    // ulozeni do Chrome storage
    await new Promise((resolve) => {
      chrome.storage.local.set(
        {
          nasaData: data,
          nasa_lastFetch: Date.now(),
        },
        resolve
      );
    });

    console.log("[nasa] ✅ Nová data uložena");
    return data;

  } catch (error) {
    console.error("❌ fetchNasaImage error", error);

    // fallback – zkusi z cache
    const { nasaData } = await new Promise((resolve) => {
      chrome.storage.local.get("nasaData", (result) => resolve(result));
    });

    if (nasaData) {
      console.warn("[nasa] ⚠️ Používám starší cache (fetch selhal).");
      return nasaData;
    }

    return { 
      error: true,
      message: "fetchNasaImage selhal – žádná data ani cache."
    };
  }
}
