import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js"
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el } from "../../utils/uiSnippets.js";

console.log("{storyOfTheDay.js} 🧩 sekce se generuje...")

export async function createStoryOfTheDay() {
    console.log("{funkce createStoryOfTheDay} ✅ funguje")

    const storyData = await fetchStoryOfTheDay()
    
    if (!storyData) {
        console.warn("⚠️ Žádný příběh nenalezen.")

        return
    }

    // 📌 VYTVORENI HTML PRVKU 
    
    // article
    const article = el("article", null, {
        border: "1px solid black"
    })

    // today 
    const today = el("h3", storyData.today || "", {

    })

    // title
    const title = el("h3", storyData.title || "", {

    })

    // content 
    const content = el("p", storyData.content || "", {

    })

    // emoji - zmena velikosti
    const emoji = el("cite", storyData.emoji || "", {
        display: "block",
        fontSize: "24px",
        marginTop: "10px"
    })

    // 👍 like 
    const like = await createInteractionButton("story_like", storyData.like, "líbí se mi")
   
    // 👎 dislike
    const dislike = await createInteractionButton("story_dislike", storyData.dislike, "nelíbí se mi")

    // wrapper pro like & dislike – vedle sebe
    const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center",
        flexWrap: "wrap",
    })
    feedbackWrapper.append(dislike, like)

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(today, title, content, emoji, feedbackWrapper)

    return article
}
