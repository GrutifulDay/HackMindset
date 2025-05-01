console.log("{fetchRetroMachine.js} 📡 je načtený");

export async function fetchRetroMachine() {
    console.log("{funkce fetchRetroMachine} ✅ funguje")

    const API_KEY = "m7m3XPVh7KMf9JkoUvXsHnGhP7av6X";

    try {
        const response = await fetch("https://localhost:3000/api/retro-machine", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            }
        })
        
        if (!response.ok) throw new Error("❌ Chyba při načítání dat");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ fetchRetroMachine error", error);
        return null;
    }
}

