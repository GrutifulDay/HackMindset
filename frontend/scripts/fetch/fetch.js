import { updateNasaData } from "./update.js";

console.log("✅ fetch.js načten");

// 🔥 FETCH Z API SERVER.JS
export async function fetchNasaImage() {
    // 🛑 Pokud není potřeba aktualizovat, použijeme uložená data
    if (!(await updateNasaData())) {
        const storage = await new Promise((resolve) => {
            chrome.storage.local.get("nasaData", (result) => {
                resolve(result);
            });
        });
        return storage.nasaData;
    }

    console.log("🌍 Načítám nová data z API...");

    try {
        const response = await fetch("http://localhost:3000/api/nasa");
        if (!response.ok) throw new Error("❌ Chyba při načítání obrázku");

        const data = await response.json();
        console.log("🔍 Data z API:", data);

        // 📝 Uložíme data do `chrome.storage`
        await chrome.storage.local.set({ nasaData: data, lastFetch: Date.now() });
        return data;
    } catch (error) {
        console.error("⚠️ Chyba při načítání NASA dat:", error);
        return null; // Pokud API selže, vrátíme null
    }
}




// KOD S PRIMO NA URL ADRESU
//🚀 NASA API fce pro nacitani IMG 
//uklada se do chrome.storage - zabrani opetovnemu nacitani
// export async function fetchNasaImage() {
//     const nasaApi = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC';
//     const today = new Date().toISOString().split("T")[0]; // Aktuální datum (YYYY-MM-DD)

//     return new Promise((resolve) => {
//         chrome.storage.local.get(["nasaData", "lastFetchDate"], async ({ nasaData, lastFetchDate }) => {
//             if (nasaData && lastFetchDate === today) return resolve(nasaData);

//             try {
//                 const { url, explanation, media_type } = await (await fetch(nasaApi)).json();
//                 if (media_type !== "image") return resolve({ url: "", explanation: "Dnes je video 🎥. Klikni na odkaz!" });

//                 const newNasaData = { url, explanation };
//                 chrome.storage.local.set({ nasaData: newNasaData, lastFetchDate: today });
//                 resolve(newNasaData);
//             } catch {
//                 resolve({ url: "", explanation: "Nepodařilo se načíst obrázek dne." });
//             }
//         });
//     });
// }




// TENHLE KOOOD byl spatne - nastevny ID  !!
// export async function fetchNasaImage() {
//     try {
//         const response = await fetch("http://localhost:3000/api/nasa")

//         if (!response.ok) throw new Error("Chyba při načítání obrázku")

//         const data = await response.json()
//         console.log(("Data z API:", data));

//         document.getElementById("nasa-image").src = data.url
//         document.getElementById("nasa-explanation").innerText = data.explanation
//     } catch (error) {
//         console.error(error.message);
//     }
// }

// MARVEL API 
// function fetchMarvel() {
//     const heroImage = document.getElementById("heroImage")
//     const heroDescription = document.getElementById("heroDescription");
//     const alterEgos = document.getElementById("alterEgos")

//     // random img pri nacteni stranky 
//     const randomId = Math.floor(Math.random() * 731) + 1

//     fetch(`https://akabab.github.io/superhero-api/api/id/${randomId}.json`) 
//         .then(response => response.json())  
//         .then(data => {  
//             heroImage.src = data.images.lg;  
//             heroDescription.textContent = data.biography.fullName || "Neznámý hrdina";  
//             alterEgos.textContent = data.biography.alterEgos
//         })
//         .catch(error => console.error("Chyba při načítání hrdiny:", error)); 
// }

// fetchMarvel()





