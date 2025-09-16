import { updateSectionData } from "../utils/update/updateSectionData.js"
import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js";

console.log("{fetchProfile.js} 📡 je načtený")


export async function fetchProfile() {
  console.log("{funkce fetchProfile} ✅ funguje");

  const token = await getJwtToken() 

  if (!token) {
    console.error("❌ Chybí JWT token fetchProfile – fetch se neprovede.");
    return null;
  }

  const shouldUpdate = await updateSectionData("profile")

  if (!shouldUpdate) {
    console.log("[profile] ⏳ Data jsou aktuální – čtu z cache.");

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
        Authorization: `Bearer ${token}`,
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

    console.log("[profile] ✅ Nová data uložena");
    return data
  } catch (error) {
    console.error("❌ fetchProfile error", error);
    return null
  }
}



