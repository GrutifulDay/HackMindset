import { el, createFadeLine } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";
import { fetchProfile } from "../fetch/fetchProfile.js";

console.log("{profile.js} 🧩 sekce se generuje...");

export async function createProfile() {
  console.log("{funkce createProfile} ✅ funguje");

  const lang = getLanguage();
  const profileData = await fetchProfile();

  // aside
  const aside = el("aside", null, {
    // paddingTop: "1rem",
  });

  // ul
  const ul = el("ul", null, {
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center"
  });

  // nadpis
  const hint = el("h3", lang === "cz" ? "Moje Insta Tipy:" : "My Insta Tips:", {});

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
      // marginBottom: "6px"
    });

    const span = el("span", tag, {});

    const button = el("button", null, {
      marginLeft: "3px",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      padding: "4px"
    }, {
      title: "Kopírovat hashtag"
    });

    // ikona copy
    const copy = el("img", null, {
      width: "30px",
      height: "30px",
      pointerEvents: "none"
    }, {
      src: "./assets/icons/copy.svg", 
    })

    const check = el("img", null, {
      width: "30px",
      height: "30px",
      pointerEvents: "none"
    }, {
      src: "./assets/icons/check.svg",
      alt: "Zkopírováno"
    })

    // zaloha pro pozdejsi vraceni
    const copyIcon = copy.cloneNode(true) 
    const checkIcon = check.cloneNode(true)

    button.appendChild(copyIcon);

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(tag)
        .then(() => {
          console.log(`✅ Zkopírováno: ${tag}`);

          // Smaž obsah a dej ✅
          button.replaceChildren(checkIcon)

          // Po 1s vrať ikonu
          setTimeout(() => {
            button.textContent = "";
            button.appendChild(copyIcon);
          }, 1000);
        })
        .catch(err => {
          console.error("❌ Chyba při kopírování:", err);
        });
    });

    li.append(span, button);
    ul.appendChild(li);
  });

  aside.append(createFadeLine(), hint, ul);
  return aside;
}
