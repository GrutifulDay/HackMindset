import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";

export async function fetchNasaImage() {
  const shouldUpdate = await updateSectionData("nasa")

  if (!shouldUpdate) {
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
    return data
  } catch (error) {
    return null
  }
}

