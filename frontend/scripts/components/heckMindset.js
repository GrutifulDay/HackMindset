export async function createHeckMindset() {
    console.log("{heckMindset.js} ✅ HeckMindset sekce se generuje...")

    const header = document.createElement("header")
    header.style.border = "1px solid black"


    const heckMindsetTitle = document.createElement("h2")
    heckMindsetTitle.textContent = "HeckMindset"


    // pozdeji se bude nacitat automaticky kazdy den
    const date = document.createElement("h3")
    date.textContent = "Dnes je 1.7.2025 a stalo se..."

    header.appendChild(heckMindsetTitle)
    header.appendChild(date)

    return header
}
