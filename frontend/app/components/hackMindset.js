import { setStyle } from "../../utils/setStyle.js"

console.log("{hackMindset.js} 🧩 sekce se generuje...")

export async function createHackMindset() {
    console.log("{funkce createHackMindset} ✅ funguje")


    // 📌 VYTVORENI HTML PRVKU 

    // header
    const header = document.createElement("header")
    setStyle(header, {
        border: "1px solid black"
    })

    // title
    const hackMindsetTitle = document.createElement("h2")
    hackMindsetTitle.textContent = "HackMindset"


    // DODELAT CAS - VYMYSLET ZPUSOB 
    const date = document.createElement("h3")
    date.textContent = "Dnes je 1.7.2025 a stalo se..."

    
    // 📌 pridani prvku do sekce - podle poradi 
    header.append(hackMindsetTitle, date)
  
    return header
}
