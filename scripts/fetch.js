console.log("✅ fetch.js načten");


function fetchMarvel() {
    const heroImage = document.getElementById("heroImage")
    const heroDescription = document.getElementById("heroDescription");
    const alterEgos = document.getElementById("alterEgos")

    // random img pri nacteni stranky 
    const randomId = Math.floor(Math.random() * 731) + 1

    fetch(`https://akabab.github.io/superhero-api/api/id/${randomId}.json`) 
        .then(response => response.json())  
        .then(data => {  
            heroImage.src = data.images.lg;  
            heroDescription.textContent = data.biography.fullName || "Neznámý hrdina";  
            alterEgos.textContent = data.biography.alterEgos
        })
        .catch(error => console.error("Chyba při načítání hrdiny:", error)); 
}

fetchMarvel()

//🚀 NASA API fce pro nacitani IMG 
//uklada se do chrome.storage - zabrani opetovnemu nacitani
// export async function fetchNasaImage() {
//     const nasaApi = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC';

//     // Nejprve se podíváme, zda obrázek už není v `chrome.storage`
//     return new Promise((resolve) => {
//         chrome.storage.local.get("nasaData", async (result) => {
//             if (result.nasaData) {
//                 console.log("📂 NASA obrázek načten z `chrome.storage`");
//                 resolve(result.nasaData);
//             } else {
//                 try {
//                     const response = await fetch(nasaApi);
//                     const data = await response.json();

//                     if (data.media_type === "image") {
//                         const nasaData = {
//                             url: data.url,
//                             explanation: data.explanation
//                         };

//                         // Uložíme obrázek do `chrome.storage`
//                         chrome.storage.local.set({ nasaData });

//                         console.log("🌍 NASA obrázek uložen do `chrome.storage`");
//                         resolve(nasaData);
//                     } else {
//                         resolve({
//                             url: "",
//                             explanation: "Dnes není obrázek, ale video 🎥. Klikni na odkaz!"
//                         });
//                     }
//                 } catch (err) {
//                     console.error("❌ Chyba při načítání NASA obrázku:", err);
//                     resolve({
//                         url: "",
//                         explanation: "Nepodařilo se načíst obrázek dne."
//                     });
//                 }
//             }
//         });
//     });
// }//

//Po 24 hod. se smaze img z chrome.storage
chrome.alarms.create("clearNasaImage", { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "clearNasaImage") {
        chrome.storage.local.remove("nasaData");
        console.log("🗑️ NASA obrázek odstraněn – příště se stáhne nový");
    }
});




