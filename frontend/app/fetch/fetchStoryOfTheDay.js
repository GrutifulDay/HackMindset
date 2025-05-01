console.log("{fetchStoryOfTheDay.js} 📡 je načtený");

export async function fetchStoryOfTheDay() {
    console.log("{funkce fetchStoryOfTheDay} ✅ funguje")

    const API_KEY = "fd982hf28HJKfd87gf9Jdf9823kjasd";
    
    try {
        const response = await fetch("https://localhost:3000/api/story-of-the-day", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            }
        });
        
        if (!response.ok) throw new Error("❌ Chyba při načítání dat");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ fetchStoryOfTheDay error", error);
        return null;
    }
}
