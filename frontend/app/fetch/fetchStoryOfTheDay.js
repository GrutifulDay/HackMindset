console.log("{fetchStoryOfTheDay.js} 📖 je načtený");

// NASTAVIT UPDATE 
export async function fetchStoryOfTheDay() {
    try {
        const response = await fetch("https://localhost:3000/api/story-of-the-day")
        if (!response.ok) throw new Error("Chyba pri nacitani dat")

        const data = await response.json()
        return data
    } catch (error) {
        console.error("fetchStoryOfTheDay error", error);
        return null
    }
}