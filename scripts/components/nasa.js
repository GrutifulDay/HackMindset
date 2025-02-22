import { fetchNasaImage } from "../fetch.js";

export async function createNasaSection() {
    console.log("✅ NASA sekce se generuje...")

    const nasaData = await fetchNasaImage()
    console.log("📌 Načtený NASA obrázek:", nasaData)

    // 📌 VYTVORENI HTML PRVKU 

    // "sekce" pro nasa
    const section = document.createElement("section")
    // section.style.marginBottom = "20px"

    // nadpis 🚀 Astronomy Picture of the Day
    const nasaTitle = document.createElement("h3")
    nasaTitle.textContent = "🚀 Astronomy Picture of the Day"

    // img
    const nasaImage = document.createElement("img")
    nasaImage.src = nasaData.url
    nasaImage.alt = "Astronomy Picture of the Day"
    nasaImage.style.width = "70%"
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
