import { el, createFadeLine } from "../../utils/dom/uiSnippets.js"
import { getLanguage } from "../../utils/language/language.js"

console.log("{hackMindset.js} 🧩 sekce se generuje...")

export async function createHackMindset() {
    console.log("{funkce createHackMindset} ✅ funguje")

    const lang = getLanguage() 

    const translations = {
        cz: {
            todayPrefix: "⏱️ Dnes je ",
            todaySuffix: " a stalo se...",
            title: "HackMindset"
        },
        en: {
            todayPrefix: "Today is ",
            todaySuffix: " and this happened...",
            title: "HackMindset"
        }
    }

    const t = translations[lang]

    // 📌 VYTVORENI HTML PRVKU 

    // header
    const header = el("header", null, {

    })

    // title
    const hackMindsetTitle = el("h2", "hack mindset", {
        fontSize: "1.8rem",
        fontWeight: "600",
        color: "#1C2A39", /* elegantní tmavě modrá */
        textAlign: "center",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)"
})

    // datum - dnes
    const today = new Date().toLocaleDateString(lang === "cz" ? "cs-CZ" : "en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    })
      
    // datum
    const date = el("h3", null, {
        // color: "#1C2A39"
    })

    const prefix = document.createTextNode(t.todayPrefix)
    const dateSpan = el("span", today, {
        fontWeight: "bold",
        color: "red",
        fontFamily: "'Rubik', sans-serif"
    })
    const suffix = document.createTextNode(t.todaySuffix)

    date.append(prefix, dateSpan, suffix)      

    // 📌 pridani prvku do sekce - podle poradi 
    header.append(hackMindsetTitle, createFadeLine(), date)
  
    return header
}
