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
    nasaTitle.style.textDecoration = "underline"

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

   // nasa odkaz
const nasaLink = document.createElement("a");
nasaLink.href = "https://apod.nasa.gov/apod/astropix.html";
nasaLink.target = "_blank";
nasaLink.textContent = "Do you want more?";
nasaLink.style.marginRight = "6px";

// 💡 žárovka
const translateInfo = document.createElement("span");
translateInfo.textContent = "💡";
translateInfo.style.fontSize = "20px"
translateInfo.style.cursor = "help";
translateInfo.style.position = "relative";

// tooltip box
const tooltipBox = document.createElement("div");
tooltipBox.textContent = `
V rámci projektu není možné využívat placené překladače pro dynamický obsah.
Všechny ostatní texty byly přeloženy ručně. Sekce NASA využívá živé API, 
které každý den mění obsah.
Bez dynamického překladu proto není možné zajistit přesný český překlad.
👉 Chcete si text přečíst česky?
Klikněte na "Do you want more?" – otevře se oficiální stránka NASA,
kde můžete použít Google Překladač.
`
tooltipBox.style.position = "absolute";
tooltipBox.style.bottom = "120%";
tooltipBox.style.left = "50%";
tooltipBox.style.transform = "translateX(-50%)";
tooltipBox.style.padding = "8px 12px";
tooltipBox.style.backgroundColor = "#333";
tooltipBox.style.color = "#fff";
tooltipBox.style.borderRadius = "6px";
tooltipBox.style.fontSize = "12px";
tooltipBox.style.lineHeight = "1.4";
tooltipBox.style.whiteSpace = "normal";
tooltipBox.style.maxWidth = "500px"
tooltipBox.style.width = "300px"
tooltipBox.style.zIndex = "10";
tooltipBox.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
tooltipBox.style.visibility = "hidden";
tooltipBox.style.opacity = "0";
tooltipBox.style.transition = "opacity 0.2s";
tooltipBox.style.pointerEvents = "none";

// zobraz/skrýj při hoveru
translateInfo.addEventListener("mouseenter", () => {
    tooltipBox.style.visibility = "visible";
    tooltipBox.style.opacity = "1";
});
translateInfo.addEventListener("mouseleave", () => {
    tooltipBox.style.visibility = "hidden";
    tooltipBox.style.opacity = "0";
});

// připojení tooltipu k ikoně
translateInfo.appendChild(tooltipBox);

// vložení do kontejneru
const container = document.createElement("div");
container.appendChild(nasaLink);
container.appendChild(translateInfo);




    // Kliknutím zobrazí celý popis
    nasaDescription.addEventListener("click", () => {
        nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText
    })

    // 📌 Přidání prvků do sekce
    section.appendChild(nasaTitle)
    section.appendChild(nasaImage)
    section.appendChild(nasaDescription)
    section.appendChild(nasaLink)
    section.appendChild(container);


    return section // Vrací sekci NASA
}
