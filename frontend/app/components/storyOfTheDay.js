export async function createStoryOfTheDay() {
    console.log("{storyOfTheDay.js}📓 Story of the day funguje");

    const storyData = {
        title: "📖 ZIP kód slaví premiéru",
        // content: "Dnes, ale v roce 1963, USA zavedly ZIP kódy. Začátek nové éry poštovní automatizace – a taky ztracených balíků. Česká pošta se tenkrát inspirovala až podezřele rychle.",
        content: "V březnu 2012 se uskutečnila unikátní akce Red Bull Stratos, jejímž cílem bylo, aby člověk dosáhl rychlosti zvuku (1 Machu, což je cca 1 235 km/h) bez letadla. Oním vyvoleným se stal rakouský parašutista Felix Baumgartner, který vystoupal ve speciální kapsli do nebes ze základny Roswell v Novém Mexiku a skočil ze stratosféry. Cíl byl splněn a s ním padly i další rekordy.",
        emoji: "📬"
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
    emoji.textContent = storyData.emoji


    // article.appendChild(today)
    article.appendChild(title)
    article.appendChild(content)
    article.appendChild(emoji)

    return article
}
