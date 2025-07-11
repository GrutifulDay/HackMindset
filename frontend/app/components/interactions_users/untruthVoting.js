import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";
import { fetchPostUntruthVotes } from "../../fetch/fetchUntruth.js";

export function createUntruthVotingWindow() {
    const lang = getLanguage()

    const container = el("div", null, {
        position: "absolute",
        padding: "15px",
        zIndex: "1000",
        maxWidth: "300px",
        display: "none",
        backgroundColor: "#f7f3ff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    })

    const closeBtn = el("span", "×", {
        position: "absolute",
        top: "5px",
        right: "10px",
        cursor: "pointer",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333"
    })

    function closeContainer() {
        container.style.display = "none";
        document.removeEventListener("click", handleOutsideClick)
    }

    function handleOutsideClick(e) {
        if (!container.contains(e.target)) {
            closeContainer()
        }
    }

    closeBtn.addEventListener("click", closeContainer)

    container.show = function (referenceElement, metadata = {}) {
        container.dataset.section = metadata.section || "unknown"
        container.dataset.date = metadata.date || "" // ← ulozi se datum 

        const rect = referenceElement.getBoundingClientRect()
        container.style.display = "block"

        const top = window.scrollY + rect.top - container.offsetHeight - 5
        const screenCenter = window.innerWidth / 2
        let left

        if (rect.left < screenCenter) {
            left = window.scrollX + rect.right + 5
        } else {
            left = window.scrollX + rect.left - container.offsetWidth - 5
        }

        container.style.top = `${top}px`
        container.style.left = `${left}px`

        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick)
        }, 0)
    }

    const title = el("strong", lang === "cz"
        ? "Chceš něco označit jako nepravda?"
        : "Do you want to label something as untrue?",
        {
            display: "block",
            marginTop: "14px",
            fontSize: "13px",
            color: "#000",
            textTransform: "uppercase"
        })

    const message = el("p", lang === "cz"
        ? "Pokud si myslíš, že tento článek není pravdivý, označ konkrétní části."
        : "If you think this article isn't true, select specific parts below.",
        {
            fontSize: "14px",
            marginTop: "8px",
            color: "#333"
        })

    const listItems = [
        lang === "cz" ? "Rok je špatně" : "The year is wrong",
        lang === "cz" ? "Není to dnešní datum" : "This is not today's date",
        lang === "cz" ? "Událost se stala jinak" : "The event happened differently",
        lang === "cz" ? "Celý článek je špatně" : "The entire story is incorrect"
    ]

    const selectedStates = [];
    const listWrapper = el("div", null, { marginTop: "12px" })

    listItems.forEach(text => {
        const isSelected = { value: false }

        const icon = el("img", null, {
            width: "20px",
            height: "20px"
        }, {
            src: "../assets/icons/mark-off.svg",
            alt: "select icon"
        })

        icon.addEventListener("click", () => {
            isSelected.value = !isSelected.value
            icon.src = isSelected.value
                ? "../assets/icons/mark-on.svg"
                : "../assets/icons/mark-off.svg"
        })

        const label = el("span", text, {
            marginLeft: "10px",
            fontSize: "14px"
        })

        const row = el("div", null, {
            display: "flex",
            alignItems: "center",
            marginBottom: "6px"
        })

        row.append(icon, label);
        listWrapper.appendChild(row);
        selectedStates.push({ text, isSelected })
    })

    const submitButton = el("button", lang === "cz" ? "Odeslat" : "Submit", {
        marginTop: "14px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#e74c3c",
        color: "white",
        fontSize: "14px",
        cursor: "pointer"
    })

    submitButton.addEventListener("click", async () => {
        const section = container.dataset.section
        const date = container.dataset.date
        const selected = selectedStates
            .filter(item => item.isSelected.value)
            .map(item => item.text)
    
        if (selected.length === 0 || !date) return
    
        console.log("📤 Odesílám hlasování z této sekce:", section)
        console.log("📅 Datum:", date)
        console.log("📌 Vybrané problémy:", selected)
    
        const result = await fetchPostUntruthVotes(date, selected, section)
    
        if (result) {
            submitButton.disabled = true
            submitButton.textContent = lang === "cz" ? "Odesláno" : "Submitted"
            submitButton.style.opacity = "0.6"
        }
    })
    

    container.append(
        closeBtn,
        title,
        message, 
        listWrapper, 
        submitButton
    )
    return container
}
