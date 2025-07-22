import { el, createFadeLine, attachInfoToggle } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { fetchDigitalSignpost } from "../fetch/fetchDigitalSignpost.js"
import { createUntruthIcon } from "./icons_import/untruthIcon.js";
import { createUntruthVotingWindow } from "./interactions_users/untruthVoting.js";
import { getCachedData, setCachedData } from "../utils/cache/localStorageCache.js";

console.log("{digitalSignpost.js} 🧩 sekce se generuje...");

export async function createDigitalSignpost() {
    console.log("{funkce createDigitalSignpost} ✅ funguje");

    const lang = getLanguage()
    const CACHE_KEY = `digital_cache_${lang}`

    let digitalData = getCachedData(CACHE_KEY)

    if (digitalData) {
        console.log("[retro] ⏳ Data jsou aktuální – čtu z cache.")
      } else {
        console.log("🌐 Načítám nová data ze serveru")
        digitalData = await fetchDigitalSignpost()  // ✅ už funguje
        if (digitalData) setCachedData(CACHE_KEY, digitalData)
      }
    
      if (!digitalData) {
        console.warn("⚠️ Žádný příběh nenalezen.");
        return
      }

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
   
    const title =  el("h3", digitalData.title?.[lang] || "", {})

    const content = el("p", digitalData.content?.[lang] || "", {})

    const recommendation = el("p", digitalData.recommendation?. [lang] ||"", {})

    // OZNACENI CHYBNE INFORMACE 
    const untruthIcon = createUntruthIcon()
    const untruthVotingWindow = createUntruthVotingWindow()
    document.body.append(untruthVotingWindow)

    const section = "digital"
    const date = digitalData.date //  napr. "2025-07-14"

    untruthIcon.dataset.section = section


    const untruthWrapper = el("div", null, {
        position: "absolute",
        top: "8px",
        left: "0px",
        zIndex: "9999",
        pointerEvents: "auto",
        opacity: "0.6",
        transition: "opacity 0.2s",        
      })
      

      untruthIcon.addEventListener("click", () => {
        console.log("🧪 CLICK DETEKTOVÁN NA untruthIcon")
        untruthVotingWindow.show(untruthIcon, {
          section,
          date
        })
      })
      

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