import { el } from "../../../utils/dom/uiSnippets.js"
import { setLanguage, getLanguage } from "../../../utils/language/language.js"

export function createLanguageSwitcher() {
  const currentLang = getLanguage() 

  const wrapper = el("div", null, {
    position: "absolute",
    top: "3px",
    left: "9px",
    zIndex: "1000",
    display: "flex",
    gap: "8px",
    cursor: "pointer",
  }, {
    id: "language-switcher"
  })

  const czFlag = el("span", "🇨🇿", { 
    fontSize: "24px",
    padding: "2px"
  })
  const enFlag = el("span", "🇬🇧", {
    fontSize: "24px",
    padding: "2px"
  })

  czFlag.title = "Čeština"
  enFlag.title = "English"

  // zvyraznění jazyka - ANIMACE bude 
  if (currentLang === "cz") {
    czFlag.classList.add("active-lang")
  } else {
    enFlag.classList.add("active-lang")
  }

  // s class ( uvidim po UX)
  // if (currentLang === "cz") {
  //   czFlag.classList.add("active-lang")
  // } else {
  //   enFlag.classList.add("active-lang")
  // }

  // .active-lang {
  //   outline: 2px solid dodgerblue;
  //   border-radius: 4px;
  //   padding: 2px;
  // }
  

  czFlag.onclick = () => {
    setLanguage("cz")
    location.reload()
  }

  enFlag.onclick = () => {
    setLanguage("en")
    location.reload()
  }

  wrapper.append(czFlag, enFlag)
  return wrapper
}
