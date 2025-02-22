export async function createHeckMindset() {
    console.log("✅ HeckMindset sekce se generuje...")

    const header = document.createElement("header")

    const heckMindsetTitle = document.createElement("h2")
    heckMindsetTitle.textContent = "HeckMindset"

    header.appendChild(heckMindsetTitle)

    return header
}
