import { fetchNasaImage } from "../fetch.js";

export async function createNasaSection() {
    console.log("✅ NASA sekce se generuje...")

    const nasaData = await fetchNasaImage()
    console.log("📌 Načtený NASA obrázek:", nasaData)

    // 📌 Vytvoření HTML prvků pro NASA sekci
    const section = document.createElement("section")
    section.style.marginBottom = "20px"

    const nasaTitle = document.createElement("h2")
    nasaTitle.textContent = "🚀 Astronomy Picture of the Day"

    const nasaImage = document.createElement("img")
    nasaImage.src = nasaData.url
    nasaImage.alt = "Astronomy Picture of the Day"
    nasaImage.style.width = "100%"
    nasaImage.style.borderRadius = "1.2em"

    const nasaDescription = document.createElement("p")
    const fullText = nasaData.explanation
    const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText

    nasaDescription.textContent = shortText
    nasaDescription.style.cursor = "pointer"

    // Kliknutím zobrazí celý popis
    nasaDescription.addEventListener("click", () => {
        nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText
    })

    // 📌 Přidání prvků do sekce
    section.appendChild(nasaTitle)
    section.appendChild(nasaImage)
    section.appendChild(nasaDescription)

    return section // Vrací sekci NASA
}
