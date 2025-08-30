import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";

console.log("{fetchRetroMachine.js} 📡 je načtený")

export async function fetchRetroMachine() {
  console.log("{funkce fetchRetroMachine} ✅ funguje");

  const shouldUpdate = await updateSectionData("retro")

  if (!shouldUpdate) {
    console.log("[retro] ⏳ Data jsou aktuální – čtu z cache.");

    const { retroData } = await new Promise((resolve) => {
      chrome.storage.local.get("retroData", (result) => resolve(result))
    })

    return retroData || null
  }

  try {
    const response = await fetch(API.retroMachine, {
      method: "GET",
      mode: "cors",
      headers: {
        "X-Client-Tag": "HACK_EXTENSION"
      }
    })

    const data = await response.json()

    await new Promise((resolve) => {
      chrome.storage.local.set(
        {
          retroData: data,
          retro_lastFetch: Date.now(),
        },
        resolve
      )
    })

    console.log("[retro] ✅ Nová data uložena");
    return data
  } catch (error) {
    console.error("❌ fetchRetroMachine error", error);
    return null
  }
}
