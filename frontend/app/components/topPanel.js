import { el } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { createAboutExtensionWindow } from "./info_icons/aboutExtension.js";
import { createLanguageSwitcher } from "./info_icons/languageSwitcher.js";
import { createInfoIcon } from "./icons_import/infoIcon.js";
import { attachInfoToggle } from "../utils/dom/uiSnippets.js";
import { debug } from "../utils/logger/logger.js";

debug("{topPanel.js} 🧩 sekce se generuje...");

export async function createTopPanel() {
  debug("{funkce createTopPanel} ✅ funguje");

  const languageSwitcher = createLanguageSwitcher()

  const aside = el("aside", null, {})

  const infoIcon = createInfoIcon()
  const aboutExtension = createAboutExtensionWindow()

  attachInfoToggle(infoIcon, aboutExtension, () => aboutExtension.show())

aside.append(languageSwitcher, infoIcon, aboutExtension)
return aside;
}
