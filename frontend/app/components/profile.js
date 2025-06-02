import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js"

import { fetchProfile } from "../fetch/fetchProfile.js";

console.log("{profile.js} 🧩 sekce se generuje...")

export async function createProfile() {
  console.log("{funkce createProfile} ✅ funguje");

  const lang = getLanguage()
  const profileData = await fetchProfile();

  // 📌 VYTVORENI HTML PRVKU 

  // aside
  const aside = el("aside", null, {});
  
  // ul
  const ul = el("ul", null, {
    listStyle: "none",
    padding: "0",
    margin: "0"
  });

  // hint / doporuceni
  const hint = el("h3", lang === "cz" ? "Moje Insta Tipy:" : "My Insta Tips:", {});

  // // konkretni klice k zobrazeni 
  const instaTipsKeys = [
    "space_learning",
    "nature_travel_wildlife",
    "science_tech_ai"
  ];

  instaTipsKeys.forEach(key => {
    const tag = profileData[key];
    if (!tag) return;

    const li = el("li", null, {
      alignItems: "center",
      marginBottom: "6px"
    });

    // span
    const span = el("span", tag, {});

    // button
    const button = el("button", "📋", {
      marginLeft: "8px",
      cursor: "pointer",
      border: "1px solid #aaa",
      borderRadius: "4px",
      background: "#f9f9f9"
    }, {
      title: "Kopírovat hashtag"
    });

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

    // 📌 pridani prvku do sekce - podle poradi 
    li.append(span, button);
    ul.appendChild(li);
  });

  // 📌 pridani prvku do sekce - podle poradi 
  aside.append(hint, ul);
  return aside;
}
