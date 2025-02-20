import { fetchNasaImage } from "./fetch.js";

console.log("✅ Content script je připojený a běží na stránce")

(async () => {
    const nasaData = await fetchNasaImage()

    console.log("Nacteny NASA img", nasaData)

    showOverlay(nasaData)
})

// Funkce pro zobrazení overlay s testovacím textem
function showOverlay() {
    if (document.getElementById("info-overlay")) return // Zabrání duplikaci

    const overlay = document.createElement("div")
    overlay.id = "info-overlay"
    overlay.style.position = "fixed"
    overlay.style.bottom = "20px"
    overlay.style.right = "20px"
    overlay.style.background = "rgba(0, 0, 0, 0.9)"
    overlay.style.color = "white"
    overlay.style.padding = "12px"
    overlay.style.borderRadius = "8px"
    overlay.style.fontSize = "14px"
    overlay.style.zIndex = "9999"
    overlay.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)"

    overlay.innerHTML = `
    <strong>🚀 NASA Obrázek dne:</strong><br>
    <img src="${nasaData.url}" alt="NASA Image" width="200"><br>
    <p id="nasa-desc">${nasaData.explanation.slice(0, 50)}...</p>
    <button id="show-full-text">📖 Více</button>
    <button id="close-nasa-overlay">✖ Zavřít</button>    `

    document.body.appendChild(overlay)

    // zobrazeni celeho textu v decsription
    document.getElementById("show-full-text").onclick = () => {
        document.getElementById("nasa-desc").textContent = nasaData.explanation
    }

    document.getElementById("close-overlay").onclick = () => overlay.remove()
}
