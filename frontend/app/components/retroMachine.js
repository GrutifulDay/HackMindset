export async function createRetroMachine() {
    console.log("{retroMachine.js}📓 Retro Machine funguje");

    const retroData = {
        "year": 1971,
        "title": "Intel 4004 – první mikroprocesor",
        "nostalgiggle": "Malý čip, velký skok. Takhle začal náš digitální svět.",
        "like": "(icon) věděl jsem",
        "dislike": "(icon) nevěděl jsem" 
    }

    // article 
    const article = document.createElement("article")
    article.style.marginBottom = "20px"
    article.style.border = "1px solid black"

    // nazev sekce 
    const titleSection = document.createElement("h3")
    titleSection.textContent = "💾 Retro Machine"
    titleSection.style.textDecoration = "underline"

    // year
    const year = document.createElement("h3")
    year.textContent = retroData.year

    // title 
    const title = document.createElement("h3")
    title.textContent = retroData.title

    // text / nostalgiggle
    const nostalgiggle = document.createElement("p")
    nostalgiggle.textContent = retroData.nostalgiggle

      // 👍 like
      const like = document.createElement("li");
      like.textContent = retroData.like;
      like.style.listStyle = "none";
      like.style.fontSize = "12px";
      like.style.cursor = "pointer";
  
      // 👎 dislike
      const dislike = document.createElement("li");
      dislike.textContent = retroData.dislike;
      dislike.style.listStyle = "none";
      dislike.style.fontSize = "12px";
      dislike.style.cursor = "pointer";
  
      // wrapper pro like & dislike – vedle sebe
      const feedbackWrapper = document.createElement("div");
      feedbackWrapper.style.display = "flex";
      feedbackWrapper.style.gap = "20px";
      feedbackWrapper.style.justifyContent = "center"
      feedbackWrapper.appendChild(dislike);
      feedbackWrapper.appendChild(like);

  
    // const remember = document.createElement("button")
    // remember.textContent = "🫶"
    // Object.assign(remember.style, {
    //     background: "none",
    //     border: "none",
    //     outline: "none",
    //     fontSize: "24px",
    //     cursor: "pointer"
    //   });

    article.appendChild(titleSection)
    article.appendChild(year)
    article.appendChild(title)
    article.appendChild(nostalgiggle)
    // article.appendChild(remember)
    article.appendChild(feedbackWrapper)
      
    return article
}