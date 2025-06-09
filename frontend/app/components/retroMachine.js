import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el, createFadeLine } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js"
import { playSound } from "../../utils/sounds/playSound.js";

console.log("{retroMachine.js} 🧩 sekce se generuje...");

export async function createRetroMachine() {
  console.log("{funkce createRetroMachine} ✅ funguje");

  const lang = getLanguage();
  const retroData = await fetchRetroMachine();

  if (!retroData) {
    console.warn("❌ Žádný retro příběh nenalezen");
    console.log("🔍 retroData:", retroData);
    return;
  }

  // 📌 VYTVOŘENÍ HTML PRVKŮ

  const article = el("article", null, {
    // paddingTop: "1rem",
  });

  const retroMachineTitle = el("h3", "💾 Retro-Machine", {});

  const year = el("h3", retroData.year ? `> ${retroData.year} <` : "", {});

  const title = el("h4", retroData.title?.[lang] || "", {});

  const nostalgiggle = el("p", retroData.nostalgiggle?.[lang] || "", {});

  // 🎵 přehrávání zvuku pouze po kliknutí na ikonu
  const modemTitleCZ = "Hayes Micromodem 100 – Modem pro domácí uživatele";
  const modemTitleEN = "Hayes Micromodem 100 – Modem for the Masses";

  if (
    retroData.title?.cz === modemTitleCZ ||
    retroData.title?.en === modemTitleEN
  ) {
    // ikona pri zvuk prehravani
    const soundIcon = el("span", "🔊", {
      marginLeft: "10px",
      cursor: "pointer",
      fontSize: "18px",
      title: "Přehraj zvuk připojení"
    });

    soundIcon.addEventListener("click", () => {
      playSound("dialup.mp3");
    });

    title.appendChild(soundIcon);
  }

  // 👍 like
  const like = await createInteractionButton(
    "retro_like",
    retroData.like,
    lang === "cz" ? "líbí se mi" : "I like it"
  );

  // 👎 dislike
  const dislike = await createInteractionButton(
    "retro_dislike",
    retroData.dislike,
    lang === "cz" ? "nelíbí se mi" : "I don't like it"
  );

  // wrapper pro tlacitka
  const feedbackWrapper = el("div", null, {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap"
  });

  feedbackWrapper.append(dislike, like);

  // 📌 pridani prvku do sekce - podle poradi 
  article.append(createFadeLine(), retroMachineTitle, year, title, nostalgiggle, feedbackWrapper);

  return article;
}
