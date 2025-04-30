import { setStyle } from "../../utils/setStyle.js";

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
    const aside = document.createElement("aside");
    const ul = document.createElement("ul");
    setStyle(ul, {
      listStyle: "none",
      padding: "0",
      margin: "0"
    })
   
    // hint / doporuceni
    const hint = document.createElement("h3")
    hint.textContent = "Moje Insta Tipy:"
  
    // hashtagData
    Object.values(hashtagData).forEach(tag => {
      const li = document.createElement("li")
      li.style.display = "center";
      li.style.alignItems = "center";
      li.style.marginBottom = "6px";
  
      // span
      const span = document.createElement("span");
      span.textContent = tag;
  
      // buttton
      const button = document.createElement("button");
      button.textContent = "📋";
      button.title = "Kopírovat hashtag";
      setStyle(button, {
        marginLeft: "8px",
        cursor: "pointer",
        border: "1px solid #aaa",
        borderRadius: "4px",
        background: "#f9f9f9"
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
  