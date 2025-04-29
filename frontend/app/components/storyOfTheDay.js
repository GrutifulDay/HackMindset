import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js";
console.log("{storyOfTheDay.js}📓 Story of the day funguje");

// UPRAVIT - ZKRATIT 
export async function createStoryOfTheDay() {
    console.log("{funkce createStoryOfTheDay}📓 Story of the day funguje");

    const storyData = await fetchStoryOfTheDay();
    
    if (!storyData) {
        console.warn("⚠️ Žádný příběh nenalezen.");
        return
    }

    // article
    const article = document.createElement("article")
    article.style.border = "1px solid black"
    //article.style.marginBottom = "20px"

    // today 
    const today = document.createElement("h3")
    today.textContent = storyData.today


    // title
    const title = document.createElement("h3")
    title.textContent = storyData.title

    // content 
    const content = document.createElement("p")
    content.textContent = storyData.content
    // const fullText = storyData.description; 
    // const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;
    // description.textContent = shortText
    // description.style.cursor = "pointer"

    // emoji - zmena velikosti
    const emoji = document.createElement("cite")
    emoji.textContent = storyData.emoji;
    emoji.style.display = "block";
    emoji.style.fontSize = "24px";
    emoji.style.marginTop = "10px";

    // 👍 like
    const like = document.createElement("li");
    like.textContent = storyData.like;
    like.style.listStyle = "none";
    like.style.fontSize = "20px";
    like.style.cursor = "pointer";

    // 👎 dislike
    const dislike = document.createElement("li");
    dislike.textContent = storyData.dislike;
    dislike.style.listStyle = "none";
    dislike.style.fontSize = "20px";
    dislike.style.cursor = "pointer";

    // wrapper pro like & dislike – vedle sebe
    const feedbackWrapper = document.createElement("div");
    feedbackWrapper.style.display = "flex";
    feedbackWrapper.style.gap = "20px";
    feedbackWrapper.style.justifyContent = "center"
    feedbackWrapper.appendChild(dislike);
    feedbackWrapper.appendChild(like);
   

    article.appendChild(today)
    article.appendChild(title)
    article.appendChild(content)
    article.appendChild(emoji)
    article.appendChild(feedbackWrapper);

    return article
}
