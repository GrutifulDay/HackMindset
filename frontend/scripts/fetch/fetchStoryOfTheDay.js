console.log("{fetchStoryOfTheDay.js} 📖 je načtený");

export async function fetchStoryOfTheDay() {
    try {
        const response = await fetch("api/story-of-the-day")
        if (!response.ok) throw new Error("Chyba pri nacitani dat")

        const data = await response.json()
        return data
    } catch (error) {
        console.error("fetchStoryOfTheDay error", error);
        return null
    }
}