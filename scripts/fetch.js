console.log("✅ fetch.js načten");

// 🚀 NASA API fce pro nacitani IMG 
export async function fetchNasaImage() {
    const nasaApi = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC';

    try {
        const response = await fetch(nasaApi);
        const data = await response.json();

        if (data.media_type === "image") {
            return {
                url: data.url,
                explanation: data.explanation
            };
        } else {
            return {
                url: "",
                explanation: "Dnes není obrázek, ale video 🎥. Klikni na odkaz níže!"
            };
        }
    } catch (err) {
        console.error("❌ Chyba při načítání obrázku z NASA API:", err);
        return {
            url: "",
            explanation: "Nepodařilo se načíst obrázek dne."
        };
    }
}
