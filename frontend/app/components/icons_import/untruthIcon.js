import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";

export function createUntruthIcon() {
  const lang = getLanguage();

  return el("img", null, {
    position: "absolute",
    width: "26px",
    height: "auto",
    cursor: "pointer",
  }, {
    src: "../assets/icons/warning.svg",
    title: lang === "cz" ? "Chces označit informaci jako nepravda? Klikni" : "Do you want to mark the information as false? Click"
  })
}


