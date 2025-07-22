import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js";
import { fetchGetVoteStory, fetchPostVoteStory } from "../fetch/fetchStoryVotes.js"
import { createVotingReportUsers } from "./interactions_users/votingReport.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";

import { createUntruthIcon } from "./icons_import/untruthIcon.js";
import { createUntruthVotingWindow } from "./interactions_users/untruthVoting.js";

import { getCachedData, setCachedData } from "../utils/cache/localStorageCache.js";

import { createAddTooltip } from "../utils/dom/tooltip.js";

console.log("{storyOfTheDay.js} 🧩 sekce se generuje...");


export async function createStoryOfTheDay() {
  console.log("{FUNKCE createStoryOfTheDay} ✅ funguje");


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

  const article = el("article", null, {
    position: "relative"
  })

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
  const voteTitle = el("p", lang === "cz" 
      ? "Chceš vidět vysledky hlasování? Hlasuj i ty." 
      : "Do you want to see the voting results? Vote too.", 
  {
    textTransform: "uppercase",
    fontSize: ".8rem",
    fontWeight: "bold",
    marginTop: "30px"
  })

 // HLASOVANI  
 const feedbackWrapper = el("div", null, {
  display: "flex",
  gap: "40px",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: "0px"
})

// vedel/a
const rememberIMG = el("img", null, {
  width: "56px",
  cursor: "pointer"
}, {
  src: "../assets/icons/zazil-white.png",
  class: "vote-img"
})
createAddTooltip( rememberIMG, 
  lang === "cz" ? "Tohle už jsem věděl/a!" : "I already knew this!"
  )

const rememberCount = el("span", "", {
  display: "none",
}, {
  className: "vote-count"
})

// nevedel/a 
const notExperienceIMG = el("img", null, {
  width: "57px",
  cursor: "pointer"
}, {
  src: "../assets/icons/nezazil-white.png",
  class: "vote-img"
})
createAddTooltip( notExperienceIMG, 
  lang === "cz" ? "Tohle jsem fakt nevěděl/a!" : "Wow, I didn’t know this!"
  )


const notExperienceCount = el("span", "", {
  display: "none"
}, {
  className: "vote-count"
})


// fce hlasovani 
function createVoteElement(imgElement, countSpan) {
  // Wrapper pro img + cislo
  const imageWrapper = el("div", null, {
    position: "relative",
    height: "100px", 
    width: "80px",
    display: "flex",
    alignItems: "flex-end", 
    justifyContent: "center",
    paddingTop: "26px" 
  })

  // img
  imgElement.style.height = "74px"
  imgElement.style.objectFit = "contain"

  // cislo nad img
  Object.assign(countSpan.style, {
    position: "absolute",
    fontFamily: "monospace",
    top: "0px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "2px 8px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#000",
    lineHeight: "20px",
    minWidth: "32px", 
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
  })

  imageWrapper.append(imgElement, countSpan)

  // cely hlasovaci blok 
  const wrapper = el("div", null, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "80px",
    height: "130px" 
  })

  wrapper.append(imageWrapper)
  return wrapper
}

// pridani fce k wrapper
const rememberWrapper = createVoteElement(rememberIMG, rememberCount) 
const notExperienceWrapper = createVoteElement(notExperienceIMG, notExperienceCount)
feedbackWrapper.append(notExperienceWrapper, rememberWrapper)

// Kontrola, zda uzivatel jiz hlasoval
const todayKey = storyData.date 
const localStorageKey = `storyVotedToday_${todayKey}` 
console.log("🧪 todayKey:", todayKey)

const voteCounts = await fetchGetVoteStory(todayKey)
const votedToday = localStorage.getItem(localStorageKey)


// zablokuje hlasovani, ukaze barevny img 
if (votedToday) {
  rememberIMG.style.pointerEvents = "none"
  notExperienceIMG.style.pointerEvents = "none"

  rememberIMG.style.opacity = votedToday === "like" ? "1" : "0.4"
  notExperienceIMG.style.opacity = votedToday === "dislike" ? "1" : "0.4"

  if (votedToday === "like") {
  rememberIMG.src = "../assets/icons/zazil-green.png"
} else {
  notExperienceIMG.src = "../assets/icons/nezazil-green.png"
}

rememberCount.textContent = voteCounts.like
notExperienceCount.textContent = voteCounts.dislike
rememberCount.style.display = "inline"
notExperienceCount.style.display = "inline"
}

// zablokuj hlasovani, zobraz barevny/vybranny img a aktual. pocty z db 
async function handleVote(option) {
  const updated = await fetchPostVoteStory(todayKey, option)
  if (!updated) return

  rememberCount.textContent = updated.like
  notExperienceCount.textContent = updated.dislike
  rememberCount.style.display = "inline"
  notExperienceCount.style.display = "inline"

  rememberIMG.style.pointerEvents = "none"
  notExperienceIMG.style.pointerEvents = "none"

  if (option === "like") {
    rememberIMG.src = "../assets/icons/zazil-green.png"
    rememberIMG.style.opacity = "1"
    notExperienceIMG.style.opacity = "0.4"
  } else {
    notExperienceIMG.src = "../assets/icons/nezazil-green.png"
    notExperienceIMG.style.opacity = "1"
    rememberIMG.style.opacity = "0.4"
  }

  localStorage.setItem(localStorageKey, option)

  createVotingReportUsers(lang === "cz" ? "Děkujeme, ze hlasujete každý den 💚" : "Thank you for voting every day 💚")
}

// Event listenery
rememberIMG.addEventListener("click", () => {
  handleVote("like")
})

notExperienceIMG.addEventListener("click", () => {
  handleVote("dislike")
})

// OZNACENI CHYBNE INFORMACE 
const untruthIcon = createUntruthIcon()
const untruthVotingWindow = createUntruthVotingWindow()
document.body.append(untruthVotingWindow)

const section = "story"
const date = storyData.date

untruthIcon.dataset.section = section

const untruthWrapper = el("div", null, {
  position: "absolute",
  top: "8px",
  right: "23px", 
  zIndex: "9999",
  opacity: "0.6",
  transition: "opacity 0.2s", 
})

untruthIcon.addEventListener("click", () => {
  untruthVotingWindow.show(untruthIcon, {
    section,
    date
  })
})

// zvyrazneni 
untruthWrapper.addEventListener("mouseenter", () => {
    untruthWrapper.style.opacity = "1"
})
  untruthWrapper.addEventListener("mouseleave", () => {
    untruthWrapper.style.opacity = "0.6"
})

untruthWrapper.append(untruthIcon)
  
  article.append(
    createFadeLine(), 
    untruthWrapper,
    storyWrapper,
    today, 
    title, 
    content,
    voteTitle,
    feedbackWrapper
  )
  return article
}
