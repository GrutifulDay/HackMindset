import { el, createFadeLine, attachInfoToggle } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { fetchDigitalSignpost } from "../fetch/fetchDigitalSignpost.js"
import { createUntruthIcon } from "./icons_import/untruthIcon.js";
import { createUntruthVotingWindow } from "./interactions_users/untruthVoting.js";

console.log("{digitalSignpost.js} 🧩 sekce se generuje...");

export async function createDigitalSignpost() {
    console.log("{funkce createDigitalSignpost} ✅ funguje");

    const lang = getLanguage()
    const digitalSignpost = await fetchDigitalSignpost()

    const article = el("article", null, {
        position: "relative"
    })

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

    // OZNACENI CHYBNE INFORMACE 
    const untruthIcon = createUntruthIcon()
    const untruthVotingWindow = createUntruthVotingWindow()
    document.body.append(untruthVotingWindow)

    const untruthWrapper = el("div", null, {
        position: "absolute",
        top: "8px",
        left: "0px",
        zIndex: "10",
        backgroundColor: "pink"
    })

    untruthIcon.addEventListener("click", () => untruthVotingWindow.show(untruthIcon))

    // zvyrazneni 
    untruthWrapper.addEventListener("mouseenter", () => {
        untruthWrapper.style.opacity = "1"
    })
      untruthWrapper.addEventListener("mouseleave", () => {
        untruthWrapper.style.opacity = "0.6"
    })
      

    untruthWrapper.append(untruthIcon)

    article.append(
        createFadeLine(),
        untruthWrapper,
        digitalWrapper,
        infoTime,
        title,
        content,
        recommendation
    )
    return article
}