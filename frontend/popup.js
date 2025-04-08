import { createNasaSection } from "./scripts/components/nasaSection.js";
import { createHeckMindset } from "./scripts/components/heckMindset.js";
import { createStoryOfTheDay } from "./scripts/components/storyOfTheDay.js";
import { createRetroMachine } from "./scripts/components/retroMachine.js";
import { createHashtag } from "./scripts/components/hashtag.js";



console.log(("✅ Popup.js načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log(("✅ Popup.js běží správně!"))

    const body = document.body

    const heckMindset = await createHeckMindset()
    const nasaSection = await createNasaSection()
    let storyOfTheDay = await createStoryOfTheDay()
    const retroMachine = await createRetroMachine()
    const hashtag = await createHashtag()

     // Ověření, že nasaSection je validní DOM prvek
     if (nasaSection) {
        body.appendChild(nasaSection);  // Přidáme sekci do body
        console.log("nasa section je nactena", nasaSection);
    } else {
        console.error("❌ NASA sekce není validní DOM prvek.");
    }

    body.appendChild(heckMindset)
    body.appendChild(nasaSection)
    body.appendChild(storyOfTheDay)
    body.appendChild(retroMachine)
    body.appendChild(hashtag)

    console.log("✅ Všechny sekce byly přidány!");
})

