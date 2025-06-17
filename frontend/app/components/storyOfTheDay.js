import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js";
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";

console.log("{storyOfTheDay.js} 🧩 sekce se generuje...");

export async function createStoryOfTheDay() {
    console.log("{FUNKCE createStoryOfTheDay} ✅ funguje");

    const lang = getLanguage()
    const storyData = await fetchStoryOfTheDay()
    
    if (!storyData) {
      console.warn("⚠️ Žádný příběh nenalezen.")
      return
    }

    const article = el("article", null, {})

    // title + ikona
    const storyOfTheDayTitle = el("h2", "Story of The Day", {}) // bude icona
    
    const storyWrapper = el("div", null, {
        position: "relative",
        marginTop: "10px"
    })
    
    const microphoneIcon = el("img", null, {
        width: "40px",
        height: "auto",
        position: "absolute",
        top: "-13px",
        left: "87px",
        opacity: ".8"
    },{
        src: "../assets/icons/microphone.svg"
    })
    storyWrapper.append(microphoneIcon, storyOfTheDayTitle)

    const today = el("h3", storyData.today || "", {})

    const title = el("h3", storyData.title?.[lang] || "", {})

    // content 
    const content = el("p", storyData.content?.[lang] || "", {})

    // img hlasovani + title hoover CZ / EN 
    const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "0px"
      })
    
      // img bez position (zarovnani se resi ve wrapperu)
    const likeIMG = el("img", null, {
        width: "57px",
        cursor: "pointer"
      }, {
        src: "../assets/icons/vedel-white.png",
        title: lang === "cz" ? "To jsem věděl!" : "I remember this!"
      })
    
    const dislikeIMG = el("img", null, {
        width: "57px",
        cursor: "pointer"
      }, {
        src: "../assets/icons/nevedel-white.png",
        title: lang === "cz" ? "To jsem nevěděl..." : "I didn’t know this..."
    })
    
    const like = createInteractionButton(
        likeIMG,
        "like",
        lang === "cz" ? "Líbí se mi" : "I like it"
    );
    
    likeIMG.addEventListener("click", () => {
      likeIMG.src = "./assets/icons/vedel-green.png"
    })
      
    dislikeIMG.addEventListener("click", () => {
      dislikeIMG.src = "./assets/icons/nevedel-green.png"
    })
    
    const dislike = createInteractionButton(
        dislikeIMG,
        "dislike",
        lang === "cz" ? "Nelíbí se mi" : "I don't like it"
    )
    
    feedbackWrapper.append(dislike, like);

    article.append(createFadeLine(), storyWrapper, today, title, content, feedbackWrapper)
    return article
}
