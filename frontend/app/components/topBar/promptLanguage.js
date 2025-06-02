import { hasLanguageSet, setLanguage } from "../../../utils/language/language.js";

// upravit vyber 

export function promptLanguageIfNotSet() {
    if (!hasLanguageSet()) {
      const lang = confirm("Chceš aplikaci v češtině? Klikni na OK pro 🇨🇿 nebo Zrušit pro 🇬🇧")
        ? "cz"
        : "en"
      setLanguage(lang)
      location.reload()
    }
}