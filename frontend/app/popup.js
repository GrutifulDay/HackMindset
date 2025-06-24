import { createTopPanel } from "./components/topPanel.js";
import { createNasaSection } from "./components/nasaSection.js";

import { createHackMindset } from "./components/hackMindset.js";
import { createStoryOfTheDay } from "./components/storyOfTheDay.js";
import { createRetroMachine } from "./components/retroMachine.js";
import { createProfile } from "./components/profile.js";
import { createDigitalSignpost } from "./components/digitalSignpost.js";
// import { createBottomPanel } from "./app/components/bottomPanel.js";

import { promptLanguageIfNotSet } from "./components/onboarding/promptLanguage.js";

console.log(("{popup.js} 📋  načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log(("{popup.js} ✅  běží správně!"))

    const body = document.body

    promptLanguageIfNotSet()

    const topPanel = await createTopPanel()
    const hackMindset = await createHackMindset()
    const nasaSection = await createNasaSection()
    const storyOfTheDay = await createStoryOfTheDay()
    const retroMachine = await createRetroMachine()
    const profile = await createProfile()
    const digitalSignpost = await createDigitalSignpost()
    // const bottomPanel = await createBottomPanel()

     // Ověření, že nasaSection je validní DOM prvek
     if (nasaSection) {
        body.appendChild(nasaSection)
        console.log("{popup.js} ✅ nasaSection je nactena", nasaSection);
    } else {
        console.error("{popup.js} ❌ NASA sekce není validní DOM prvek.");
    }

    // 📌 pridani prvku do sekce - podle poradi 
    [ topPanel, hackMindset, nasaSection,digitalSignpost, storyOfTheDay, retroMachine, profile]
        .filter(Boolean) // odstrani vsechny  undefined, null, false nebo 0 - bude jen to co existuje 
        .forEach(section => body.appendChild(section))
    
    console.log("{popup.js} ✅ Všechny sekce byly přidány!");
})

