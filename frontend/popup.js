import { createNasaSection } from "./app/components/nasaSection.js";
import { createHackMindset } from "./app/components/hackMindset.js";
import { createStoryOfTheDay } from "./app/components/storyOfTheDay.js";
import { createRetroMachine } from "./app/components/retroMachine.js";
import { createHashtag } from "./app/components/hashtag.js";



console.log(("{popup.js} ✅  načten správně!"))

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
        console.log("{popup.js} nasa section je nactena", nasaSection);
    } else {
        console.error("{popup.js} ❌ NASA sekce není validní DOM prvek.");
    }

    body.appendChild(hackMindset)
    body.appendChild(nasaSection)
    body.appendChild(storyOfTheDay)
    body.appendChild(retroMachine)
    body.appendChild(hashtag)

    console.log("{popup.js} ✅ Všechny sekce byly přidány!");
})

