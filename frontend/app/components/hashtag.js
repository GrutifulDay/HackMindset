import { el } from "../../utils/uiSnippets.js";

console.log("{hashtag.js} 🧩 sekce se generuje...")

// UPRAVIT 
export async function createHashtag() {
  console.log("{funkce createHashtag} ✅ funguje")
  
    const hashtagData = {
      science_tech_ai: "sciencemagazine",
      nature_travel_wildlife: "beautifuldestinations",
      space_learning: "nasa"
    };
  
    // 📌 VYTVORENI HTML PRVKU 
    
    //aside
    const aside = el("aside", null, {})

    //el
    const ul = el("ul", null, {
      listStyle: "none",
      padding: "0",
      margin: "0"
    })
   
    // hint / doporuceni
    const hint = el("h3", "Moje Insta Tipy:", {

    })
  
    // hashtagData
    Object.values(hashtagData).forEach(tag => {
      const li = el("li", null, {
        // display: "flex", // center
        alignItems: "center",
        marginBottom: "6px"
      })
  
      // span
      const span = el("span", tag, {})
  
      // buttton
      const button = el("button", "📋", {
        marginLeft: "8px",
        cursor: "pointer",
        border: "1px solid #aaa",
        borderRadius: "4px",
        background: "#f9f9f9"
      }, {
        title: "Kopírovat hashtag"
      })
    

  
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(tag)
          .then(() => {
            console.log(`✅ Zkopírováno: ${tag}`);
            button.textContent = "✅";
            setTimeout(() => {
              button.textContent = "📋";
            }, 1000);
          })
          .catch(err => {
            console.error("❌ Chyba při kopírování:", err);
          })
      })

    // 📌 pridani prvku do sekce - podle poradi 
    li.append(span, button)

    ul.appendChild(li)
    
    aside.appendChild(hint)
    })
    
    // 📌 pridani prvku do sekce - podle poradi 
    aside.appendChild(ul)
    
    return aside
  }
  