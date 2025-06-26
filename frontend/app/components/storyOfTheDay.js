import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js";
import { clearOldInteractions } from "../utils/update/updateInteraction.js";
import { createInteractionButton } from "./interactions_users/interactionButton.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { getCachedData, setCachedData } from "../utils/cache/localStorageCache.js";

console.log("{storyOfTheDay.js} 🧩 sekce se generuje...");


export async function createStoryOfTheDay() {
  console.log("{FUNKCE createStoryOfTheDay} ✅ funguje");

  clearOldInteractions(["likeIMG", "dislikeIMG"])

  const lang = getLanguage()
  const CACHE_KEY = `story_cache_${lang}`

  let storyData = getCachedData(CACHE_KEY)

  if (storyData) {
    console.log("[story] ⏳ Data jsou aktuální – čtu z cache.")
  } else {
    console.log("🌐 Načítám nová data ze serveru");
    storyData = await fetchStoryOfTheDay()
    if (storyData) setCachedData(CACHE_KEY, storyData)
  }

  if (!storyData) {
    console.warn("⚠️ Žádný příběh nenalezen.");
    return
  }

  const article = el("article", null, {});

  const storyOfTheDayTitle = el("h2", "Story of The Day", {})
  const storyWrapper = el("div", null, {
    position: "relative",
    marginTop: "-7px",
  })

  const microphoneIcon = el(
    "img",
    null,
    {
      width: "40px",
      height: "auto",
      position: "absolute",
      top: "-13px",
      left: "87px",
      opacity: ".8",
    },
    {
      src: "../assets/icons/microphone.svg",
    }
  )
  storyWrapper.append(microphoneIcon, storyOfTheDayTitle)

  const today = el("h3", storyData.today || "", {})
  const title = el("h3", storyData.title?.[lang] || "", {})
  const content = el("p", storyData.content?.[lang] || "", {})

  // const feedbackWrapper = el("div", null, {
  //   display: "flex",
  //   gap: "40px",
  //   justifyContent: "center",
  //   flexWrap: "wrap",
  //   marginTop: "0px",
  // })

  // const likeIMG = el(
  //   "img",
  //   null,
  //   {
  //     width: "57px",
  //     cursor: "pointer",
  //   },
  //   {
  //     src: "../assets/icons/vedel-white.png",
  //     title: lang === "cz" ? "To jsem věděl!" : "I remember this!",
  //   }
  // )

  // const dislikeIMG = el(
  //   "img",
  //   null,
  //   {
  //     width: "57px",
  //     cursor: "pointer",
  //   },
  //   {
  //     src: "../assets/icons/nevedel-white.png",
  //     title:
  //       lang === "cz" ? "To jsem nevěděl..." : "I didn’t know this...",
  //   }
  // )

  // const like = createInteractionButton(
  //   likeIMG,
  //   "like",
  //   lang === "cz" ? "Líbí se mi" : "I like it"
  // )

  // likeIMG.addEventListener("click", () => {
  //   likeIMG.src = "../assets/icons/vedel-green.png"
  //   localStorage.setItem("retro_like", "1")
  //   localStorage.setItem(
  //     "retro_like_date",
  //     new Date().toISOString().slice(0, 10)
  //   )
  // })

  // dislikeIMG.addEventListener("click", () => {
  //   dislikeIMG.src = "../assets/icons/nevedel-green.png"
  //   localStorage.setItem("retro_dislike", "1")
  //   localStorage.setItem(
  //     "retro_dislike_date",
  //     new Date().toISOString().slice(0, 10)
  //   )
  // })

  // feedbackWrapper.append(dislike, like) // 

  article.append(createFadeLine(), storyWrapper, today, title, content)
  return article
}

