import { el } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";

import { createAboutExtension } from "./info_icons/aboutExtension.js";
import { createLanguageSwitcher } from "./info_icons/languageSwitcher.js";
import { createInfoIcon } from "./icons_import/infoIcon.js";

import { attachInfoToggle } from "../utils/dom/uiSnippets.js";


console.log("{topPanel.js} 🧩 sekce se generuje...");

// INFO IKONA EXTENSION 
export async function createTopPanel() {
  console.log("{funkce createTopPanel} ✅ funguje");

  const lang = getLanguage()
  const languageSwitcher = createLanguageSwitcher()

  const aside = el("aside", null, {
    // border: "1px solid black"
  })

  // tooltip - ???
  // const infoIcon = createTooltipElement("img", null, {
  //   width: "29px",
  //   height: "auto",
  //   cursor: "pointer"
  // }, {
  //   src: "./assets/icons/info.svg"
  // }, lang === "cz" ? "O rozšíření" : "About extension");
  
  // infoIcon.classList.add("absolute-tooltip");
  // infoIcon.style.position = "absolute";
  // infoIcon.style.top = "13px";
  // infoIcon.style.right = "10px";

  const infoIcon = createInfoIcon()
  const aboutExtension = createAboutExtension()

  // klik na ikonu 
  attachInfoToggle(infoIcon, aboutExtension, () => aboutExtension.show())

aside.append(languageSwitcher, infoIcon, aboutExtension)
return aside;
}
