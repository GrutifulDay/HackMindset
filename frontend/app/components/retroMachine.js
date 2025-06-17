import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { playSound } from "../utils/sounds/playSound.js"

console.log("{retroMachine.js} 🧩 sekce se generuje...");

export async function createRetroMachine() {
    console.log("{funkce createRetroMachine} ✅ funguje");

    const lang = getLanguage()
    const retroData = await fetchRetroMachine()

    if (!retroData) {
      console.warn("❌ Žádný retro příběh nenalezen");
      console.log("🔍 retroData:", retroData);
      return
    }

    const article = el("article", null, {})

    // nadpis + ikona
    const retroMachineTitle = el("h2", "Retro Machine", {});
    const retroWrapper = el("div", null, {
      position: "relative",
      marginTop: "10px"
    });

    const televisionIcon = el("img", null, {
      width: "40px",
      height: "auto",
      position: "absolute",
      top: "-15px",
      right: "101px",
      opacity: ".8"
    }, {
      src: "./assets/icons/television.svg"
    })

  retroWrapper.append(televisionIcon, retroMachineTitle)

  // nadpisy + text
  const year = el("h3", retroData.year ? `> ${retroData.year} <` : "", {})
  const title = el("h3", retroData.title?.[lang] || "", {})
  const nostalgiggle = el("p", retroData.nostalgiggle?.[lang] || "", {})

  // zvukova ikona
  const modemTitleCZ = "Hayes Micromodem 100 – Modem pro domácí uživatele"
  const modemTitleEN = "Hayes Micromodem 100 – Modem for the Masses"

  if (
    retroData.title?.cz === modemTitleCZ ||
    retroData.title?.en === modemTitleEN
  ) {
    const soundIcon = el("span", "🔊", {
      marginLeft: "10px",
      cursor: "pointer",
      fontSize: "18px",
      title: "Přehraj zvuk připojení"
    })

    soundIcon.addEventListener("click", () => {
      playSound("dialup.mp3")
    })

    title.appendChild(soundIcon)
  }

  // interakcni tlacitka 
  const feedbackWrapper = el("div", null, {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "0px"
  })

  // img bez position (zarovnani se resi ve wrapperu)
  const likeIMG = el("img", null, {
    width: "57px",
    cursor: "pointer"
  }, {
    src: "./assets/icons/vedel-white.png",
    title: lang === "cz" ? "Tohle si pamatuju!" : "I remember this!"
  })

  const dislikeIMG = el("img", null, {
    width: "57px",
    cursor: "pointer"
  }, {
    src: "./assets/icons/nevedel-white.png",
    title: lang === "cz" ? "Tohle jsem nezažil/a!" : "I didn’t experience this!"
  })

  const like = createInteractionButton(
    likeIMG,
    "like",
    lang === "cz" ? "Líbí se mi" : "I like it"
  )

  likeIMG.addEventListener("click", () => {
    likeIMG.src = "./assets/icons/vedel-green.png" // např. zelený obrázek po kliknutí
  })
  
  dislikeIMG.addEventListener("click", () => {
    dislikeIMG.src = "./assets/icons/nevedel-green.png" // např. červený obrázek po kliknutí
  })

  const dislike = createInteractionButton(
    dislikeIMG,
    "dislike",
    lang === "cz" ? "Nelíbí se mi" : "I don't like it"
  )

  feedbackWrapper.append(dislike, like)


  article.append(
    createFadeLine(),
    retroWrapper,
    year,
    title,
    nostalgiggle,
    feedbackWrapper
  )
  return article
}
