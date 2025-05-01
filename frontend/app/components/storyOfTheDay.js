import { el } from "../../utils/uiSnippets.js";
import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js"

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
    const like = el("li", storyData.like || "", {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
    }, {
        title: "To se mi líbí"
    })
   
    // 👎 dislike
    const dislike = el("li", storyData.dislike || "", {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
    }, {
        title: "To se mi nelíbí"
    })

    // wrapper pro like & dislike – vedle sebe
    const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "20px",
        justifyContent: "center"
    })
    feedbackWrapper.append(dislike, like)

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(today, title, content, emoji, feedbackWrapper)

    return article
}
