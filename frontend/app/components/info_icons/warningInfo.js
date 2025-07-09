import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";

export function createUntruthVotingWindow() {
    const lang = getLanguage()

    const container = el("div", null, {
        position: "absolute",
        bottom: "122px",
        right: "28px",
        padding: "15px",
        zIndex: "1000",
        maxWidth: "300px",
        display: "none",
        backgroundColor: "#f7f3ff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)", 
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

    // zavreni okna
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

    container.show = function () {
        container.style.display = "block";
        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick)
        }, 0)
    }

    // texty 
    const title = el("strong", lang === "cz"
        ? "Chceš něco označit jako nepravda?"
        : "Do you want to label something as untrue?"
    )

    const message = el("p", lang === "cz"
        ? "Pokud si myslíš, že tento článek není pravdivý, označ konkrétní části."
        : "If you think this article isn't true, select specific parts below.",
        {
            fontSize: "14px",
            marginTop: "8px",
            color: "#333"
        }
    )

    // DOPLNIT text
    const listItems = [
        lang === "cz" ? "9. 7. 2025" : "July 9, 2025",
        lang === "cz" ? "Špatná informace" : "Incorrect info",
        lang === "cz" ? "Další text" : "Another text",
        lang === "cz" ? "Ještě jeden text" : "One more text"
    ]

    const selectedStates = []

    const listWrapper = el("div", null, {
        marginTop: "12px"
    })

    listItems.forEach(text => {
        const isSelected = { value: false }

        const icon = el("img", null, {
            width: "20px",
            height: "20px",
            cursor: "pointer"
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

        row.append(icon, label)
        listWrapper.appendChild(row)
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

    submitButton.addEventListener("click", () => {
        const selected = selectedStates
            .filter(item => item.isSelected.value)
            .map(item => item.text)

        console.log("Označeno jako nepravda:", selected)
        // tady pak fetch 

        submitButton.disabled = true
        submitButton.textContent = lang === "cz" ? "Odesláno" : "Submitted"
        submitButton.style.opacity = "0.6"
    })

    container.append(closeBtn, title, message, listWrapper, submitButton)
    return container
}
