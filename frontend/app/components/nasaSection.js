import { el, createFadeLine } from "../../utils/dom/uiSnippets.js";
import { fetchNasaImage } from "../fetch/fetchNasa.js";

console.log("{nasaSection.js} 🧩 sekce se generuje...")


export async function createNasaSection() {
    console.log("{funkce createNasaSection} ✅ funguje")

    const nasaData = await fetchNasaImage();
    console.log("{nasaSection.js}📌 Načtený NASA obrázek:", nasaData);

    // 📌 VYTVORENI HTML PRVKU 
    
    // "sekce" pro nasa
    const section = el("section", null, {
        // padding: "1rem",
    })      

    // 🚀 Astronomy Picture of the Day
    const nasaTitle = el("h3", null)
    const title = document.createTextNode("🚀 Astronomy Picture of the Day by ")
    const link = el("a", "NASA", {
        color: "#007BFF",
        textDecoration: "none",
        fontWeight: "bold"
    }, {
        href: "https://www.nasa.gov",
        target: "_blank"
    })
    nasaTitle.append(title, link)


    // img 
    const nasaImage = el("img", null, {
        width: "45%",
        borderRadius: "1.2em",
        border: ".3em solid pink"
    }, {
        src: nasaData.url,
        alt: "Astronomy Picture of the Day"
    })

    // popis - clanek
    const fullText = nasaData.explanation
    const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText
    const nasaDescription = el("p", shortText, {
        cursor: "pointer"
    })

    // Kliknutím zobrazí celý popis
    nasaDescription.addEventListener("click", () => {
        nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText
    })

    // Do you want more? - odkaz - UPRAVIT aby byla dvojjazycna ‼
    const nasaLink = el("a", "Do you want more?",{

    }, {
        href: "https://apod.nasa.gov/apod/astropix.html",
        target: "_blank"
    })

    // 📌 pridani prvku do sekce - podle poradi 
    section.append(createFadeLine(), nasaTitle, nasaImage, nasaDescription, nasaLink)
    
    return section
}
