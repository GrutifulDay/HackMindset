import { fetchStoryOfTheDay } from "../fetch/fetchStoryOfTheDay.js";
import { fetchGetVoteStory, fetchPostVoteStory } from "../fetch/fetchStoryVotes.js"
import { createVotingReportUsers } from "./interactions_users/votingReport.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { getCachedData, setCachedData } from "../utils/cache/localStorageCache.js";

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

 // HLASOVANI  
 const feedbackWrapper = el("div", null, {
  display: "flex",
  gap: "40px",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: "0px"
})

const rememberIMG = el("img", null, {
  width: "56px",
  cursor: "pointer"
}, {
  src: "../assets/icons/zazil-white.png",
  title: lang === "cz" ? "Tohle si pamatuju!" : "I remember this!",
  class: "vote-img"
})

const notExperienceIMG = el("img", null, {
  width: "57px",
  cursor: "pointer"
}, {
  src: "../assets/icons/nezazil-white.png",
  title: lang === "cz" ? "Tohle jsem nezažil/a!" : "I didn’t experience this!",
  class: "vote-img"
})

const rememberCount = el("span", "", {
  display: "none"
}, {
  className: "vote-count"
})

const notExperienceCount = el("span", "", {
  display: "none"
}, {
  className: "vote-count"
})

// fce hlasovani 
function createVoteElement(imgElement, countSpan) {
  const wrapper = el("div", null, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px"
  })
  wrapper.append(imgElement, countSpan)
  return wrapper
}

// pridani fce k wrapper
const rememberWrapper = createVoteElement(rememberIMG, rememberCount) 
const notExperienceWrapper = createVoteElement(notExperienceIMG, notExperienceCount)
feedbackWrapper.append(notExperienceWrapper, rememberWrapper)

// Kontrola, zda uzivatel jz hlasoval
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
  
  article.append(createFadeLine(), 
    storyWrapper,
    today, 
    title, 
    content,
    feedbackWrapper
  )
  return article
}

