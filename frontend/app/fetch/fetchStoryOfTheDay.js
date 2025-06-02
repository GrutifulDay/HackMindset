import { updateSectionData } from "../../utils/update/updateSectionData.js"
import { API } from "../../utils/config.js";

console.log("{fetchStoryOfTheDay.js} 📡 je načtený")

export async function fetchStoryOfTheDay() {
  console.log("{funkce fetchStoryOfTheDay} ✅ funguje");

  const shouldUpdate = await updateSectionData("story")

  if (!shouldUpdate) {
    console.log("[story] ⏳ Data jsou aktuální – čtu z cache.");

    const { storyData } = await new Promise((resolve) => {
      chrome.storage.local.get("storyData", (result) => resolve(result))
    })

    return storyData || null
  }

  try {
    const response = await fetch(API.storyOfTheDay, {
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
          storyData: data,
          story_lastFetch: Date.now(),
        },
        resolve
      )
    })

    console.log("[story] ✅ Nová data uložena");
    return data
  } catch (error) {
    console.error("❌ fetchStoryOfTheDay error", error);
    return null
  }
}



