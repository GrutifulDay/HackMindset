import { el } from "../../utils/uiSnippets.js"
import { getLanguage } from "../../utils/language.js"

console.log("{hackMindset.js} 🧩 sekce se generuje...")

export async function createHackMindset() {
    console.log("{funkce createHackMindset} ✅ funguje")

    const lang = getLanguage() 

    const translations = {
        cz: {
            todayPrefix: "Dnes je ",
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
    const hackMindsetTitle = el("h2", "HackMindset", {

    })

    // datum - dnes
    const today = new Date().toLocaleDateString(lang === "cz" ? "cs-CZ" : "en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    })
      
    // datum
    const date = el("h3", null, {
        color: "hotpink"
    })

    const prefix = document.createTextNode(t.todayPrefix)
    const dateSpan = el("span", today, {
        color: "black",
        fontWeight: "bold"
    })
    const suffix = document.createTextNode(t.todaySuffix)

    date.append(prefix, dateSpan, suffix)      

    // 📌 pridani prvku do sekce - podle poradi 
    header.append(hackMindsetTitle, date)
  
    return header
}
