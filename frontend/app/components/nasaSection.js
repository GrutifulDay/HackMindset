import { setStyle } from "../../utils/setStyle.js";
import { fetchNasaImage } from "../fetch/fetchNasa.js";

console.log("{nasaSection.js} 🧩 sekce se generuje...")



// ZKRATIT 
export async function createNasaSection() {
    console.log("{funkce createNasaSection} ✅ funguje")

    const nasaData = await fetchNasaImage();

    console.log("{nasaSection.js}📌 Načtený NASA obrázek:", nasaData);

    // 📌 VYTVORENI HTML PRVKU 
    
    // "sekce" pro nasa
    const section = document.createElement("section")
    setStyle(section, {
        border:  "2px solid black"
    })
    

    // section.style.marginBottom = "20px"

    // nadpis 🚀 Astronomy Picture of the Day
    const nasaTitle = document.createElement("h3");
    nasaTitle.innerHTML = `🚀 Astronomy Picture of the Day by 
    <a href="https://www.nasa.gov" 
    target="_blank" 
    style="color: #007BFF; 
    text-decoration: none; 
    font-weight: 
    bold;"
    >NASA</a>`


    // img
    const nasaImage = document.createElement("img")
    nasaImage.src = nasaData.url
    nasaImage.alt = "Astronomy Picture of the Day"
    setStyle(nasaImage, {
        width: "45%",
        borderRadius: "1.2em",
        border: ".3em solid black"
    })
    

    // popis - clanek
    const nasaDescription = document.createElement("p")
    const fullText = nasaData.explanation
    const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText

    nasaDescription.textContent = shortText
    setStyle(nasaDescription, {
        cursor: "pointer"
    })
 

    const nasaLink = document.createElement("a")
    nasaLink.href = "https://apod.nasa.gov/apod/astropix.html"
    nasaLink.target = "_blank"
    nasaLink.textContent = "Do you want more?"


    // Kliknutím zobrazí celý popis
    nasaDescription.addEventListener("click", () => {
        nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText
    })

    // 📌 pridani prvku do sekce - podle poradi 
    section.append(nasaTitle, nasaImage, nasaDescription, nasaLink)
    
    return section // Vrací sekci NASA
}
