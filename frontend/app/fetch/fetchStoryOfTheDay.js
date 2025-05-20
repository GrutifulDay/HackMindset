import { API } from "../../config.js"

console.log("{fetchStoryOfTheDay.js} 📡 je načtený")

export async function fetchStoryOfTheDay() {
  console.log("{funkce fetchStoryOfTheDay} ✅ funguje");
  
  try {
    const response = await fetch(API.storyOfTheDay, {
      mode: "cors",
      headers: {
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    if (!response.ok) throw new Error("❌ Chyba při načítání dat")

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ fetchStoryOfTheDay error", error);
    return null
  }
}
