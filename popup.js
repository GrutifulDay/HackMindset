import { createNasaSection } from "./scripts/components/nasa.js";
import { createHeckMindset } from "./scripts/components/heckMindset.js";
import { createStoryOfTheDay } from "./scripts/components/storyOfTheDay.js";

console.log(("✅ Popup.js načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    console.log(("✅ Popup.js běží správně!"))

    const body = document.body

    const heckMindset = await createHeckMindset()
    const nasaSection = await createNasaSection()
    const storyOfTheDay = await createStoryOfTheDay()

    body.appendChild(heckMindset)
    body.appendChild(nasaSection)
    body.appendChild(storyOfTheDay)



    console.log("✅ NASA sekce přidána!");
})






