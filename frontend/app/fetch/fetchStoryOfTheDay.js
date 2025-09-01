import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";

export async function fetchStoryOfTheDay() {
  const shouldUpdate = await updateSectionData("story")

  if (!shouldUpdate) {
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
        "X-Client-Tag": "HACK_EXTENSION"
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
    return data
  } catch (error) {
    console.error("❌ fetchStoryOfTheDay error", error);
    return null
  }
}



