export async function createStoryOfTheDay() {
    console.log("{storyOfTheDay.js}📓 Story of the day funguje");

    const storyData = {
        title: "📖 ZIP kód slaví premiéru",
        content: "Dnes, ale v roce...1963 Amerika spouští ZIP kódy a s nimi i novou kapitolu poštovní historie 📬. Balíky dostávají vlastní číselnou identitu, stroje začínají třídit jak o život a doručování má být rychlejší než kdy dřív. Jenže než si všichni zvykli, pár zásilek se cestou ztratilo. A možná bloudí dodnes...",
        // content: "V březnu 2012 se uskutečnila unikátní akce Red Bull Stratos, jejímž cílem bylo, aby člověk dosáhl rychlosti zvuku (1 Machu, což je cca 1 235 km/h) bez letadla. Oním vyvoleným se stal rakouský parašutista Felix Baumgartner, který vystoupal ve speciální kapsli do nebes ze základny Roswell v Novém Mexiku a skočil ze stratosféry. Cíl byl splněn a s ním padly i další rekordy.",
        like: "👍",
        emoji: "📬",
        dislike: "👎"
    };

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
   

    //article.appendChild(today)
    article.appendChild(title)
    article.appendChild(content)
    article.appendChild(emoji)
    article.appendChild(feedbackWrapper);

    return article
}
