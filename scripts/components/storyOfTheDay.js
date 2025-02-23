export async function createStoryOfTheDay() {
    console.log(("📓 Story of the day funguje"));

    const storyData = {
        title: "🌍 Příběh dne: První člověk na Měsíci",
        content: "Dne 20. července 1969 vstoupil Neil Armstrong jako první člověk na povrch Měsíce. Jeho slavná slova 'Malý krok pro člověka, obrovský skok pro lidstvo' se zapsala do historie.",
        author: "UI"
    };

    const article = document.createElement("article")
    article.style.marginBottom = "20px"

    // nadpis
    const title = document.createElement("h2")
    title.textContent = storyData.title

    // odstavec
    const description = document.createElement("p")
    const fullText = storyData.content;
    const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;
    description.textContent = shortText
    description.style.cursor = "pointer"

    // napsal
    const author = document.createElement("cite")
    author.textContent = storyData.author

    article.appendChild(title)
    article.appendChild(description)
    article.appendChild(author)

    return article
}