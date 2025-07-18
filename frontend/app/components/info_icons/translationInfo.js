import { el } from "../../utils/dom/uiSnippets.js";

// VISUAL - "INFO O PREKLADU" - okno / pouze pri CZ vyberu
export function createTranslationInfoWindow() {
    const container = el("div", null, {
        position: "absolute",
        bottom: "102px",
        right: "47px",
        padding: "15px",
        zIndex: "1000",
        maxWidth: "300px",
        display: "none", // start hidden 

        backgroundColor: "#fff8e1",
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

    // fce click zavreni mimo element container
    function closeContainer() {
        container.style.display = "none";
        document.removeEventListener("click", handleOutsideClick)
    }

    // zavreni klik na X
    closeBtn.addEventListener("click", closeContainer)

    // Zavření kliknutím mimo container
    function handleOutsideClick(e) {
        if (!container.contains(e.target)) {
            closeContainer();
        }
    }

    // fce pro zobraceni volana zvenku 
    container.show = function () {
        container.style.display = "block";
        // prodleva mezi klikem a zavrenim
        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 0);
    };

    // texty 
    const title = el("strong", "Překlad");

    // doplnit logo z google 
    const line1 = el("p", "Jazyk je zatím možný pouze v angličtině, pokud chcěš text v čestine, klikni na odkaz >Chceš vědět víc?< a klikni na >Přeložit tuto stránku s tímto logem<.")

    const line2 = el("p", "...");


    container.append(closeBtn, title, line1, line2);
    return container;
}


