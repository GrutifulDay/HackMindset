import { el } from "../../../utils/dom/uiSnippets.js"
import { setLanguage, getLanguage } from "../../../utils/language/language.js"

// VISUAL - PREPINANI JAZYKA 
export function createLanguageSwitcher() {
  const currentLang = getLanguage()

  function createFlagWrapper(src, title, isActive) {
    // vlozeni do wrapper pro zarovnani 
    const wrapper = el("div", null, {
      width: "24px",
      height: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "2px", 
    })

    // cz + en 
    const flag = el("img", null, {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "transform 0.2s ease",
    }, {
      src
    })

    flag.title = title

    if (isActive) {
      flag.classList.add("active-lang")
    }

    wrapper.append(flag)
    return { wrapper, flag }
  }

  // volba jazyka + hoover title
  const { wrapper: czWrapper, flag: czFlag } = createFlagWrapper("./assets/icons/CZ.svg", "Čeština", currentLang === "cz")
  const { wrapper: enWrapper, flag: enFlag } = createFlagWrapper("./assets/icons/EN.svg", "English", currentLang === "en")

  czFlag.onclick = () => {
    setLanguage("cz")
    location.reload()
  }

  enFlag.onclick = () => {
    setLanguage("en")
    location.reload()
  }

  // cela cast cz / en 
  const wrapper = el("div", null, {
    position: "absolute",
    top: "13px",
    left: "10px",
    zIndex: "1000",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  }, {
    id: "language-switcher"
  })


  wrapper.append(czWrapper, enWrapper)
  return wrapper
}
