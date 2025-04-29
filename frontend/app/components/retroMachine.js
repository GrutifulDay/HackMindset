import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";

// UPRAVIT - ZKRATIT
export async function createRetroMachine() {
    console.log("{funkce createRetroMachine}📓 Retro Machine funguje");

    
    const retroData = await fetchRetroMachine()
    
    if (!retroData) {
      console.warn("❌ Žádný retro příběh nenalezen");
      console.log("🔍 retroData:", retroData);

      return
    }

    // article 
    const article = document.createElement("article")
    Object.assign(article.style, {
        marginBottom: "20px",
        border: "2px solid black"
    })    
  
     // year
     const year = document.createElement("h3")
     year.textContent = retroData.year
     Object.assign(year.style, {

     })

    // title 
    const title = document.createElement("h4")
    title.textContent = retroData.title
    Object.assign(title.style, {
        
    })

    // nostalgiggle / text
    const nostalgiggle = document.createElement("p")
    nostalgiggle.textContent = retroData.nostalgiggle
    Object.assign(nostalgiggle.style, {
        
    })

      // 👍 like
      const like = document.createElement("li");
      like.textContent = retroData.like;
      Object.assign(like.style, {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
      })
      
  
  
      // 👎 dislike
      const dislike = document.createElement("li");
      dislike.textContent = retroData.dislike;
      Object.assign(dislike.style, {
        listStyle: "none",
        fontSize: "20px", 
        cursor: "pointer"
      })
     
  
      // wrapper pro like & dislike – vedle sebe
      const feedbackWrapper = document.createElement("div");
      Object.assign(feedbackWrapper.style, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center"
      })
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

    
    article.appendChild(year)
    article.appendChild(title)
    article.appendChild(nostalgiggle)
    // article.appendChild(remember)
    article.appendChild(feedbackWrapper)
      
    return article
}