import { updateSectionData } from "../utils/update/updateSectionData.js";
import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js";
import { debug } from "../utils/logger/logger.js";

debug("{fetchDigitalSignpost.js} 📡 je načtený");

export async function fetchDigitalSignpost() {
  debug("{funkce fetchDigitalSignpost} ✅ funguje");

  const token = await getJwtToken() 
  if (!token) {
    console.error("❌ Chybí JWT token fetchDigitalSignpost – fetch se neprovede.");
    return null;
  }

  const shouldUpdate = await updateSectionData("digitalSignpost", "weekly");

  if (!shouldUpdate) {
    debug("[digitalSignpost] ⏳ Data jsou aktuální – čtu z cache.");

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
          Authorization: `Bearer ${token}`,
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

    debug("[digitalSignpost] ✅ Nová data uložena");
    return data
  } catch (error) {
    console.error("❌ fetchDigitalSignpost error", error);
    return null
  }
}
