import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { setStyle } from "../../utils/setStyle.js";

console.log("{retroMachine.js} 🧩 sekce se generuje...")


export async function createRetroMachine() {
  console.log("{funkce createRetroMachine} ✅ funguje")

    
    const retroData = await fetchRetroMachine()
    
    if (!retroData) {
      console.warn("❌ Žádný retro příběh nenalezen");
      console.log("🔍 retroData:", retroData);

      return
    }

    // 📌 VYTVORENI HTML PRVKU 

    // article 
    const article = document.createElement("article")
    setStyle(article, {
        marginBottom: "20px",
        border: "2px solid red"
    })    
  
     // year
     const year = document.createElement("h3")
     year.textContent = retroData.year
     setStyle(year, {

     })

    // title 
    const title = document.createElement("h4")
    title.textContent = retroData.title
    setStyle(title, {
        
    })

    // nostalgiggle / text
    const nostalgiggle = document.createElement("p")
    nostalgiggle.textContent = retroData.nostalgiggle
    setStyle(nostalgiggle, {
        
    })

      // 👍 like
      const like = document.createElement("li");
      like.textContent = retroData.like;
      setStyle(like, {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
      })
      
  
  
      // 👎 dislike
      const dislike = document.createElement("li");
      dislike.textContent = retroData.dislike;
      setStyle(dislike, {
        listStyle: "none",
        fontSize: "20px", 
        cursor: "pointer"
      })
     
  
      // wrapper pro like & dislike – vedle sebe
      const feedbackWrapper = document.createElement("div");
      setStyle(feedbackWrapper, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center"
      })
      feedbackWrapper.append(dislike, like)
     

  
    // const remember = document.createElement("button")
    // remember.textContent = "🫶"
    // Object.assign(remember.style, {
    //     background: "none",
    //     border: "none",
    //     outline: "none",
    //     fontSize: "24px",
    //     cursor: "pointer"
    //   });

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(year, title, nostalgiggle, feedbackWrapper)
    
    return article
}