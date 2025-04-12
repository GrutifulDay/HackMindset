import { fetchNasaImage } from "../fetch/fetchNasa.js";

export async function createNasaSection() {
    console.log("{nasaSection.js}✅ NASA sekce se generuje...");

    const nasaData = await fetchNasaImage();

    console.log("{nasaSection.js}📌 Načtený NASA obrázek:", nasaData);


    console.log("{nasaSection.js}✅ NASA sekce se generuje...")

    

    // 📌 VYTVORENI HTML PRVKU 

    // "sekce" pro nasa
    const section = document.createElement("section")
    section.style.border = "2px solid black"

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
    nasaImage.style.width = "45%"
    nasaImage.style.borderRadius = "1.2em"
    nasaImage.style.border = ".3em solid black"

    // popis - clanek
    const nasaDescription = document.createElement("p")
    const fullText = nasaData.explanation
    const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText

    nasaDescription.textContent = shortText
    nasaDescription.style.cursor = "pointer"

    const nasaLink = document.createElement("a")
    nasaLink.href = "https://apod.nasa.gov/apod/astropix.html"
    nasaLink.target = "_blank"
    nasaLink.textContent = "Do you want more?"


    // Kliknutím zobrazí celý popis
    nasaDescription.addEventListener("click", () => {
        nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText
    })

    // 📌 Přidání prvků do sekce
    section.appendChild(nasaTitle)
    section.appendChild(nasaImage)
    section.appendChild(nasaDescription)
    section.appendChild(nasaLink)

    return section // Vrací sekci NASA
}
