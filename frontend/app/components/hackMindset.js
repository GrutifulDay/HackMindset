import { el } from "../../utils/uiSnippets.js"

console.log("{hackMindset.js} 🧩 sekce se generuje...")

export async function createHackMindset() {
    console.log("{funkce createHackMindset} ✅ funguje")


    // 📌 VYTVORENI HTML PRVKU 

    // header
    const header = el("header", null, {
        border: "1px solid black"
    })

    // title
    const hackMindsetTitle = el("h2", "HackMindset", {

    })

    // DODELAT CAS - VYMYSLET ZPUSOB 
    const date = el("h3", "Dnes je 1.7.2025 a stalo se...", {
        color: "blue"
    })

    // 📌 pridani prvku do sekce - podle poradi 
    header.append(hackMindsetTitle, date)
  
    return header
}
