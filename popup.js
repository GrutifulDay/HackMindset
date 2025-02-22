import { createNasaSection } from "./scripts/components/nasa.js";

console.log(("✅ Popup.js načten správně!"))

document.addEventListener("DOMContentLoaded", async () => {
    console.log(("✅ Popup.js běží správně!"))

    const body = document.body

    const nasaSection = await createNasaSection()
    body.appendChild(nasaSection)

    console.log("✅ NASA sekce přidána!");
})






