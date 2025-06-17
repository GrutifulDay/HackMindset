import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";

export function createTranslationIcon() {
  const lang = getLanguage();

  return el("img", null, {
    width: "20px",
    height: "auto",
    cursor: "pointer",
    position: "absolute",
    top: "-26px",
    right: "10px",
    opacity: ".8",
  }, {
    src: "./assets/icons/infoTranslation.svg",
    title: lang === "cz" ? "O překladu" : "About Translation"
  });
}
