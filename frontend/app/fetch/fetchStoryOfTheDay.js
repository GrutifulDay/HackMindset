console.log("{fetchStoryOfTheDay.js} 📡 je načtený")

export async function fetchStoryOfTheDay() {
  console.log("{funkce fetchStoryOfTheDay} ✅ funguje");
  
  try {
    const response = await fetch("https://localhost:3000/api/story-of-the-day", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-extension-auth": "HECK_EXTENSION"
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
