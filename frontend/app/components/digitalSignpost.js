import { el, createFadeLine, attachInfoToggle } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { fetchDigitalSignpost } from "../fetch/fetchDigitalSignpost.js"
import { createWarningIcon } from "./icons_import/warningIcon.js";
import { createWarningInfoWindow } from "./info_icons/warningInfo.js";

console.log("{digitalSignpost.js} 🧩 sekce se generuje...");

export async function createDigitalSignpost() {
    console.log("{funkce createDigitalSignpost} ✅ funguje");

    const lang = getLanguage()
    const digitalSignpost = await fetchDigitalSignpost()

    const warningIcon = createWarningIcon()
    const warningInfoWindow = createWarningInfoWindow()

    const article = el("article", null, {})

    const digitalWrapper = el("div", null, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginTop: "17px",
        marginLeft: "53px"
        
    })

    const titleDigitalSignpost = el ("h2", lang === "cz" ? "Digitální rozcestník" : "Digital signpost", {
        margin: "0"

    })
    const signpostIcon = el("img", null, {
        width: "40px",
        height: "auto",
        opacity: ".8",
        transform: "translateY(-9px)"
    }, {
        src: "../assets/icons/signpost.svg"
    })
    digitalWrapper.append(titleDigitalSignpost, signpostIcon)


    const infoTime = el("p", lang === "cz" ? "> Vychází každé pondělí <" :  "> Published every Monday <", {},{
        id: "info-TimeDescription"
    })
   
    const title =  el("h3", digitalSignpost.title?.[lang] || "", {})

    const content = el("p", digitalSignpost.content?.[lang] || "", {})

    const recommendation = el("p", digitalSignpost.recommendation?. [lang] ||"", {})

    warningIcon.addEventListener("click", () => warningInfoWindow.show())

    document.body.append(warningInfoWindow)

    article.append(
        createFadeLine(),
        digitalWrapper,
        infoTime,
        title,
        content,
        warningIcon,
        recommendation
    )
    return article
}