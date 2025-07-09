import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";

// VISUAL - "O ROZSIRENI" - okno - CZ / EN
export function createAboutExtensionWindow() {
    const lang = getLanguage()
    
    const texts = {
        cz: {
            title: "O rozšíření",
            line1: "Toto rozšíření ti každý den zobrazí nový obsah – příběh, retro technologii i obrázek od NASA.",
            line2: "Cílem je nahradit bezmyšlenkovité scrollování smysluplným obsahem. Každý den trochu moudřejší.",
        },
        en: {
            title: "About Extension",
            line1: "This extension shows you new content every day – a story, retro tech, and a NASA image.",
            line2: "The goal is to replace mindless scrolling with meaningful content. A little wiser every day.",
        }
    }

    const t = texts[lang] || texts.en

    const container = el("div", null, {
        position: "absolute",
        top: "36px",
        right: "32px",
        backgroundColor: "#ffe5f0",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: "1000",
        maxWidth: "300px",
        display: "none"
    }, {
        id: "info-panel"
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
        document.removeEventListener("click", handleOutsideClick);
    }
    function handleOutsideClick(e) {
        if (!container.contains(e.target)) {
            closeContainer();
        }
    }

    // zavreni click na X 
    closeBtn.addEventListener("click", closeContainer);

    container.show = function () {
        container.style.display = "block"
        // prodleva
        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick)
        }, 0)
    }

    const title = el("strong", t.title)
    const line1 = el("p", t.line1)
    const line2 = el("p", t.line2)

    const footer = el("footer", null, {})

    const gitHubLink = el("a", null, {
        display: "inline-block"
    }, {
        href: "https://github.com/GrutifulDay/HackMindset.git",
        target: "_blank",
        rel: "noopener noreferrer"
    })

    const gitHubIcon = el("img", null, {
        width: "40px",
        height: "auto",
        cursor: "pointer"
    }, {
        src: "../assets/icons/github.svg",
        title: "GitHub",
    })

    gitHubLink.append(gitHubIcon)
    footer.append(gitHubLink)
    container.append(closeBtn, footer, title, line1, line2)
    return container
}
