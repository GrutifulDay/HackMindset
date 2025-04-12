export async function createHashtag() {
    console.log("{hashtag.js}✅ ＃Hashtag sekce se generuje...");
  
    const hashtagData = {
      science_tech_ai: "sciencemagazine",
      nature_travel_wildlife: "beautifuldestinations",
      space_learning: "nasa"
    };
  
    const aside = document.createElement("aside");
    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";


    // hint / doporuceni
    const hint = document.createElement("h3")
    hint.textContent = "Moje tipy:"
  
    Object.values(hashtagData).forEach(tag => {
      const li = document.createElement("li");
      li.style.display = "center";
      li.style.alignItems = "center";
      li.style.marginBottom = "6px";
  
      const span = document.createElement("span");
      span.textContent = tag;
  
      const button = document.createElement("button");
      button.textContent = "📋";
      button.title = "Kopírovat hashtag";
      button.style.marginLeft = "8px";
      button.style.cursor = "pointer";
      button.style.border = "1px solid #aaa";
      button.style.borderRadius = "4px";
      button.style.background = "#f9f9f9";
  
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
          });
      });
  
      li.appendChild(span);
      li.appendChild(button);
      ul.appendChild(li);
      aside.appendChild(hint)
    });
  
    aside.appendChild(ul);
    
    return aside; 
  }
  