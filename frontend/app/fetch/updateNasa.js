// bude obecna funkce? nebo oddelena? 
console.log("{updateNasa.js} 📡 je načtený");


export async function updateNasaData() {
    console.log("{funkce updateNasaData} ✅ funguje")

    const now = Date.now();

    // 🟢 Získáme data z `chrome.storage`
    const storage = await new Promise((resolve) => {
        chrome.storage.local.get(["nasaData", "lastFetch"], (result) => {
            resolve(result);
        });
    });

    const nasaData = storage.nasaData;
    const lastFetch = storage.lastFetch;

    // 🕛 Nastavení času aktualizace NASA dat (00:05 každý den)
    const nasaUpdateTime = new Date();
    nasaUpdateTime.setHours(0, 5, 0, 0);

    const sixHours = 6 * 60 * 60 * 1000; // 6 hodin

    // ✅ První otevření → API se volá hned (nečeká na 00:05)
    if (!nasaData || !lastFetch) {
        console.log("{updateNasa.js}🚀 První otevření - stahuji data.");
        return true;
    }

    // 🛑 Pokud jsou data mladší než 6 hodin a není čas aktualizace, API nevoláme
    if (lastFetch && now - lastFetch < sixHours && now < nasaUpdateTime) {
        console.log("{updateNasa.js}⏳ Data jsou stále aktuální, API se nevolá.");
        return false;
    }

    // Jinak je potreba aktualizovat data ( bud v 00:05 nebo po 6h)
    return true;
}
