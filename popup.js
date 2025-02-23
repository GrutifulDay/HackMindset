import { createNasaSection } from "./scripts/components/nasa.js";
import { createHeckMindset } from "./scripts/components/heckMindset.js";
import { createStoryOfTheDay } from "./scripts/components/storyOfTheDay.js";
// import { fetchStory } from "./scripts/database.js"; // ✅ Import databázové funkce

console.log(("✅ Popup.js načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log(("✅ Popup.js běží správně!"))

    const body = document.body

    const heckMindset = await createHeckMindset()
    const nasaSection = await createNasaSection()
    let storyOfTheDay = await createStoryOfTheDay()

    // 📡 Načtení příběhu z databáze
    // const storyData = await fetchStory();
    
    // 🔄 Aktualizace obsahu příběhu
    // storyOfTheDay.querySelector("h2").textContent = storyData.title;
    // storyOfTheDay.querySelector("p").textContent = storyData.content;
    // storyOfTheDay.querySelector("cite").textContent = storyData.author;

    body.appendChild(heckMindset)
    body.appendChild(nasaSection)
    body.appendChild(storyOfTheDay)

    console.log("✅ Všechny sekce byly přidány!");
})
