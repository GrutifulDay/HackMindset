import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js"
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el, createFadeLine } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js"


console.log("{storyOfTheDay.js} 🧩 sekce se generuje...")

export async function createStoryOfTheDay() {
    console.log("{FUNKCE createStoryOfTheDay} ✅ funguje")

    const lang = getLanguage()
    const storyData = await fetchStoryOfTheDay()
    
    if (!storyData) {
        console.warn("⚠️ Žádný příběh nenalezen.")

        return
    }

    // 📌 VYTVORENI HTML PRVKU 
    
    // article
    const article = el("article", null, {
        // paddingTop: "1rem",
    })

    const storyOfTheDayTitle = el("h3", "📖 Story of The Day", {

    })

    // today 
    const today = el("h4", storyData.today || "", {
        color: "red"
    })

    // title
    const title = el("h3", storyData.title?.[lang] || "", {

    })

    // content 
    const content = el("p", storyData.content?.[lang] || "", {

    })

    // emoji - zmena velikosti
    // const emoji = el("cite", storyData.emoji, {
    //     display: "block",
    //     fontSize: "24px",
    //     marginTop: "10px"
    // })

    // 👍 like - vedel jsem 
    const like = await createInteractionButton("story_like", storyData.like, lang === "cz" ? "líbi se mi" : "I like it")
   
    // 👎 dislike - nevedel jsem 
    const dislike = await createInteractionButton("story_dislike", storyData.dislike, lang === "en" ? "nelíbí se mi" : "I don't like it")

    // wrapper pro like & dislike – vedle sebe
    const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center",
        flexWrap: "wrap",
    })
    feedbackWrapper.append(dislike, like)

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(createFadeLine(), storyOfTheDayTitle, today, title, content, feedbackWrapper)

    return article
}
