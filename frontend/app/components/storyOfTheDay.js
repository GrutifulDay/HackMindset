import { setStyle } from "../../utils/setStyle.js"
import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js"

console.log("{storyOfTheDay.js} 🧩 sekce se generuje...")

// UPRAVIT - ZKRATIT 
export async function createStoryOfTheDay() {
    console.log("{funkce createStoryOfTheDay} ✅ funguje")

    const storyData = await fetchStoryOfTheDay()
    
    if (!storyData) {
        console.warn("⚠️ Žádný příběh nenalezen.")
        return
    }

    // 📌 VYTVORENI HTML PRVKU 
    
    // article
    const article = document.createElement("article")
    setStyle(article, {
        border: "1px solid black"
    })

   

    // today 
    const today = document.createElement("h3")
    today.textContent = storyData.today
    setStyle(today, {
       
    })


    // title
    const title = document.createElement("h3")
    title.textContent = storyData.title
    setStyle(today, {
       
    })

    // content 
    const content = document.createElement("p")
    content.textContent = storyData.content
    // const fullText = storyData.description 
    // const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText
    // description.textContent = shortText
    // description.style.cursor = "pointer"

    // emoji - zmena velikosti
    const emoji = document.createElement("cite")
    emoji.textContent = storyData.emoji
    setStyle(emoji, {
        display: "block",
        fontSize: "24px",
        marginTop: "10px"
    })
  

    // 👍 like
    const like = document.createElement("li")
    like.textContent = storyData.like
    setStyle(like, {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
    })
   

    // 👎 dislike
    const dislike = document.createElement("li")
    dislike.textContent = storyData.dislike
    setStyle(dislike, {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
    })
    

    // wrapper pro like & dislike – vedle sebe
    const feedbackWrapper = document.createElement("div")
    setStyle(feedbackWrapper, {
        display: "flex",
        gap: "20px",
        justifyContent: "center"
    })
    feedbackWrapper.append(dislike, like)
    

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(today, title, content, emoji, feedbackWrapper)

    return article
}
