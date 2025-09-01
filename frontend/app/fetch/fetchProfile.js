import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";

export async function fetchProfile() {
  const shouldUpdate = await updateSectionData("profile")

  if (!shouldUpdate) {
    const { profileData } = await new Promise((resolve) => {
      chrome.storage.local.get("profileData", (result) => resolve(result))
    })
    return profileData || null
  }

  try {
    const response = await fetch(API.profile, {
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
          profileData: data,
          profile_lastFetch: Date.now(),
        },
        resolve
      )
    })
    return data
  } catch (error) {
    console.error("❌ fetchProfile error", error);
    return null
  }
}



