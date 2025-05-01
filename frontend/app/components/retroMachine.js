import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { el } from "../../utils/uiSnippets.js";

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
    const article = el("article", null, {
      marginBottom: "20px",
      border: "2px solid red"
    })
  
     // year
     const year = el("h3", retroData.year || "", {

     })

    // title 
    const title = el("h4", retroData.title || "", {

    })

    // nostalgiggle / text
    const nostalgiggle = el("p", retroData.nostalgiggle, {

    })

      // 👍 like - pamatuji si (emoji bude upravno)
      const like = el("li", retroData.like, {
        listStyle: "none",
        fontSize: "20px",
        cursor: "pointer"
      })
  
  
      // 👎 dislike - nemapamtuji si (emoji bude upravno)
      const dislike = el("li", retroData.dislike, {
        listStyle: "none",
        fontSize: "20px", 
        cursor: "pointer"
      })
     
  
      // wrapper pro like & dislike – vedle sebe
      const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center"
      })
      feedbackWrapper.append(dislike, like)

      // remember
    // const remember = el("button", "🫶", {
    //     background: "none",
    //     border: "none",
    //     outline: "none",
    //     fontSize: "24px",
    //     cursor: "pointer"
    // })

    // 📌 pridani prvku do sekce - podle poradi 
    article.append(year, title, nostalgiggle, feedbackWrapper)
    
    return article
}