import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { fetchProfile } from "../fetch/fetchProfile.js";

console.log("{profile.js} 🧩 sekce se generuje...");

export async function createProfile() {
  console.log("{funkce createProfile} ✅ funguje");

  const lang = getLanguage()
  const profileData = await fetchProfile()

  const aside = el("aside", null, {})

  const ul = el("ul", null, {
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center"
  })

  // nadpis
  const profileWrapper = el("div", null, {
    position: "relative",
    marginTop: "10px",
  })

  const instaIcon = el("img", null, {
    width: "40px",
    height: "auto",
    position: "absolute",
    top: "-11px",
    left: "91px",
    opacity: ".8"
    
  }, {
    src: "../assets/icons/insta.svg"
  })
  const hint = el("h2", lang === "cz" ? "Moje Insta Tipy:" : "My Insta Tips:", {})

  profileWrapper.append(instaIcon, hint)

  const instaTipsKeys = [
    "space_learning",
    "nature_travel_wildlife",
    "science_tech_ai"
  ]

  instaTipsKeys.forEach(key => {
    const tag = profileData[key];
    if (!tag) return

    const li = el("li", null, {
      alignItems: "center",
  })

  const span = el("span", tag, {});

  const button = el("button", null, {
    marginLeft: "3px",
    cursor: "pointer",
    border: "none",
    padding: "4px",
    background: "transparent",
  }, {
    title: lang === "cz" ? "Zkopíruj" : "Copy"
  })

  const copy = el("img", null, {
    width: "20px",
    height: "20px",
    pointerEvents: "none"
  }, {
    src: "../assets/icons/copy.svg", 
  })

  const check = el("img", null, {
    width: "20px",
    height: "20px",
    pointerEvents: "none"
  }, {
    src: "../assets/icons/check.svg",
  })

  // zaloha pro pozdejsi vraceni
  const copyIcon = copy.cloneNode(true) 
  const checkIcon = check.cloneNode(true)

  button.appendChild(copyIcon);

  // fce pro kopirovani
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(tag)
      .then(() => {
        console.log(`✅ Zkopírováno: ${tag}`)

        // smaz obsah a nahrad 
        button.replaceChildren(checkIcon)

        // Po 1s vrati ikonu 
        setTimeout(() => {
          button.textContent = ""
          button.appendChild(copyIcon)
          }, 1000)
        })
        .catch(err => {
          console.error("❌ Chyba při kopírování:", err)
        })
      })

    li.append(span, button)
    ul.appendChild(li)
  })

  aside.append(createFadeLine(), profileWrapper, ul)
  return aside
}
