import { el } from "../../utils/uiSnippets.js";

console.log("{topBar.js} 🧩 sekce se generuje...")

export function createLanguageSwitcher() {
    const flag = el("span", "🇨🇿", {
        position: "absolute",
        top: "3px",
        left: "9px",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: "1000" 
    })

    flag.title = "Změnit jazyk (zatím neaktivní)"

    return flag
}
