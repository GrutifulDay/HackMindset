import { createNasaSection } from "./app/components/nasaSection.js";
import { createHackMindset } from "./app/components/hackMindset.js";
import { createStoryOfTheDay } from "./app/components/storyOfTheDay.js";
import { createRetroMachine } from "./app/components/retroMachine.js";
import { createHashtag } from "./app/components/hashtag.js";

// BUDE EXPORT DO CONTENT KVULI VZHLEDU 

console.log(("{popup.js} 📋  načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log(("{popup.js} ✅  běží správně!"))

    const body = document.body

    const hackMindset = await createHackMindset()
    const nasaSection = await createNasaSection()
    let storyOfTheDay = await createStoryOfTheDay()
    const retroMachine = await createRetroMachine()
    const hashtag = await createHashtag()

     // Ověření, že nasaSection je validní DOM prvek
     if (nasaSection) {
        body.appendChild(nasaSection);  // Přidáme sekci do body
        console.log("{popup.js} ✅ nasaSection je nactena", nasaSection);
    } else {
        console.error("{popup.js} ❌ NASA sekce není validní DOM prvek.");
    }

    // 📌 pridani prvku do sekce - podle poradi 
    [hackMindset, nasaSection, storyOfTheDay, retroMachine, hashtag]
        .filter(Boolean) // odstrani vsechny  undefined, null, false nebo 0 - bude jen to co existuje 
        .forEach(section => body.appendChild(section))
    
    console.log("{popup.js} ✅ Všechny sekce byly přidány!");
})

