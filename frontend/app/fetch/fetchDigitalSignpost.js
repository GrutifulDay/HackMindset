import { updateSectionData } from "../utils/update/updateSectionData.js";
import { API } from "../utils/config.js";

export async function fetchDigitalSignpost() {
  const shouldUpdate = await updateSectionData("digitalSignpost", "weekly");

  if (!shouldUpdate) {
    const { digitalSignpostData } = await new Promise((resolve) => {
      chrome.storage.local.get("digitalSignpostData", (result) => resolve(result));
    })

    return digitalSignpostData || null
  }
  try {
    const response = await fetch(API.digitalSignpost, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": "Bearer HACK_EXTENSION",
      },
    })

    const data = await response.json();

    await new Promise((resolve) => {
      chrome.storage.local.set(
        {
          digitalSignpostData: data,
          digitalSignpost_lastFetch: Date.now(),
        },
        resolve
      )
    })
    return data
  } catch (error) {
    console.error("❌ fetchDigitalSignpost error", error);
    return null
  }
}
