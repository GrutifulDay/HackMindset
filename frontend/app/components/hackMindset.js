export async function createHackMindset() {
    console.log("{hackMindset.js} ✅ HackMindset sekce se generuje...")

    const header = document.createElement("header")
    header.style.border = "1px solid black"


    const hackMindsetTitle = document.createElement("h2")
    hackMindsetTitle.textContent = "HackMindset"


    // DODELAT CAS - VYMYSLET ZPUSOB 
    const date = document.createElement("h3")
    date.textContent = "Dnes je 1.7.2025 a stalo se..."

    header.appendChild(hackMindsetTitle)
    header.appendChild(date)

    return header
}
