export async function createRetroMachine() {
    console.log("{retroMachine.js}📓 Retro Machine funguje");

    const retroData = {
        "year": 1971,
        "title": "Intel 4004 – první mikroprocesor",
        "nostalgiggle": "Malý čip, velký skok. Takhle začal náš digitální svět."   
    }

    // article 
    const article = document.createElement("article")
    article.style.marginBottom = "20px"
    article.style.border = "1px solid black"

     // year
     const year = document.createElement("h3")
     year.textContent = retroData.year

    // title 
    const title = document.createElement("h4")
    title.textContent = retroData.title

    // text / nostalgiggle
    const nostalgiggle = document.createElement("p")
    nostalgiggle.textContent = retroData.nostalgiggle

    // remember
    const remember = document.createElement("button")
    remember.textContent = "🫶"
    Object.assign(remember.style, {
        background: "none",
        border: "none",
        outline: "none",
        fontSize: "24px",
        cursor: "pointer"
      });

    article.appendChild(year)
    article.appendChild(title)
    article.appendChild(nostalgiggle)
    article.appendChild(remember)
      
    return article
}