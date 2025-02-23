import { createNasaSection } from "./scripts/components/nasa.js";
import { createHeckMindset } from "./scripts/components/heckMindset.js";

console.log(("✅ Popup.js načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log(("✅ Popup.js běží správně!"))

    const body = document.body

    const heckMindset = await createHeckMindset()
    const nasaSection = await createNasaSection()

    body.appendChild(heckMindset)
    body.appendChild(nasaSection)

    console.log("✅ Všechny sekce byly přidány!");
})
