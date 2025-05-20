import { API } from "../../config.js"

console.log("{fetchProfile.js} 📡 je načtený")

export async function fetchProfile() {
  console.log("{funkce fetchProfile} ✅ funguje");

  try {
    const response = await fetch(API.profile, {
      mode: "cors",
      headers: {
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    if (!response.ok) throw new Error("❌ Chyba při načítání dat")

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ fetchProfile error", error);
    return null
  }
}
