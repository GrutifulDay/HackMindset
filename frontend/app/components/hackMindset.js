import { el } from "../../utils/uiSnippets.js"

console.log("{hackMindset.js} 🧩 sekce se generuje...")

export async function createHackMindset() {
    console.log("{funkce createHackMindset} ✅ funguje")


    // 📌 VYTVORENI HTML PRVKU 

    // header
    const header = el("header", null, {
    })

    // title
    const hackMindsetTitle = el("h2", "HackMindset", {

    })

    // datum - dnes
    const today = new Date().toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    })
      
    // datum
    const date = el("h3", null, {
        color: "hotpink"
    })

    const prefix = document.createTextNode("Dnes je ")

    const dateSpan = el("span", today, {
        color: "black",
        fontWeight: "bold"
    })

    const suffix = document.createTextNode(" a stalo se...")

    date.append(prefix, dateSpan, suffix)
      

    // 📌 pridani prvku do sekce - podle poradi 
    header.append(hackMindsetTitle, date)
  
    return header
}
