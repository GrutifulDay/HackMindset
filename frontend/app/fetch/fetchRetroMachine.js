import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";

export async function fetchRetroMachine() {

  const shouldUpdate = await updateSectionData("retro")

  if (!shouldUpdate) {
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
        "Authorization": "Bearer HACK_EXTENSION"
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
    return data
  } catch (error) {
    return null
  }
}
