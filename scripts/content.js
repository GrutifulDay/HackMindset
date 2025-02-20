import { fetchNasaImage } from "./fetch";

console.log("✅ Content script je připojený a běží na stránce");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Přijatá zpráva od `background.js`:", message);

    if (message.action === "showContent") {
        console.log("📌 Spouštím funkci na zobrazení obsahu...");
        showOverlay();
    }
});

// Funkce pro zobrazení overlay s testovacím textem
function showOverlay() {
    if (document.getElementById("info-overlay")) return; // Zabrání duplikaci

    const overlay = document.createElement("div");
    overlay.id = "info-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "20px";
    overlay.style.right = "20px";
    overlay.style.background = "rgba(0, 0, 0, 0.9)";
    overlay.style.color = "white";
    overlay.style.padding = "12px";
    overlay.style.borderRadius = "8px";
    overlay.style.fontSize = "14px";
    overlay.style.zIndex = "9999";
    overlay.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";

    overlay.innerHTML = `
        <strong>🔍 Testovací overlay:</strong><br>
        Tento text je jen test, aby se ověřilo, že content.js správně reaguje na zprávy.<br><br>
        <button id="close-overlay" style="margin-top:5px;">✖ Zavřít</button>
    `;

    document.body.appendChild(overlay);

    document.getElementById("close-overlay").onclick = () => overlay.remove();
}
