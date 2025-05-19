import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { createInteractionButton } from "./interactions_users/interactionButton.js";
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
      const like = await createInteractionButton("retro_like", retroData.like, "líbi se mi")
  
      // 👎 dislike - nemapamtuji si (emoji bude upravno)
      const dislike = await createInteractionButton("retro_dislike", retroData.dislike, "nelíbí se mi")
     
      // 🧠 remember - bude doplneno podle UX v DB 
      // const remember = createInteractionButton("retro_remember", retroData.remember, "vzpomínám si")
  
      // wrapper pro like & dislike – vedle sebe
      const feedbackWrapper = el("div", null, {
        display: "flex",
        gap: "20px", 
        justifyContent: "center",
        flexWrap: "wrap",
      })
      feedbackWrapper.append(dislike, like) // pridat pripadny remember atd. 


    // 📌 pridani prvku do sekce - podle poradi 
    article.append(year, title, nostalgiggle, feedbackWrapper)
    
    return article
}