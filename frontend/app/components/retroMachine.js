import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { fetchGetVoteRetro, fetchPostVoteRetro } from "../fetch/fetchRetroVotes.js";
import { createVotingReportUsers } from "./interactions_users/votingReport.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { getCachedData, setCachedData } from "../utils/cache/localStorageCache.js";
import { createModemSound } from "./sound_section/modem.js";


console.log("{retroMachine.js} 🧩 sekce se generuje...");

export async function createRetroMachine() {
  console.log("{funkce createRetroMachine} ✅ funguje");

  const lang = getLanguage()
  const CACHE_KEY = `retro_cache_${lang}`

  let retroData = getCachedData(CACHE_KEY)

  if (retroData) {
    console.log("[story] ⏳ Data jsou aktuální – čtu z cache.")
  } else {
    console.log("🌐 Načítám nová data ze serveru");
    retroData = await fetchRetroMachine()
    if (retroData) setCachedData(CACHE_KEY, retroData)
  }

  if (!retroData) {
    console.warn("⚠️ Žádný příběh nenalezen.");
    return
  }

  const article = el("article")

  const retroMachineTitle = el("h2", "Retro Machine")
  const retroWrapper = el("div", null, {
    position: "relative",
    marginTop: "10px"
  })

  const televisionIcon = el("img", null, {
    width: "40px",
    height: "auto",
    position: "absolute",
    top: "-18px",
    right: "101px",
    opacity: ".8"
  }, {
    src: "../assets/icons/television.svg"
  })

  retroWrapper.append(televisionIcon, retroMachineTitle)

  const year = el("h3", retroData.year ? `> ${retroData.year} <` : "")
  const title = el("h3", retroData.title?.[lang] || "")
  const nostalgiggle = el("p", retroData.nostalgiggle?.[lang] || "")

  // FCE PRO ZVUK 
  createModemSound(retroData, lang, title)

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

  const todayKey = retroData.date 
  console.log("🧪 todayKey:", todayKey)


  // Nacteni hlasu z DB
  const voteCounts = await fetchGetVoteRetro(todayKey)
  
  // Kontrola, zda uzivatel jz hlasoval
  const votedToday = localStorage.getItem("retroVotedToday")

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

  // zablokuj hlasovani, zobraz barevny/vybranny img a aktualyzovane pocty z db 
  async function handleVote(option) {
    const updated = await fetchPostVoteRetro(todayKey, option)
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

    localStorage.setItem("retroVotedToday", option)

    createVotingReportUsers(lang === "cz" ? "Děkujeme, ze hlasujete každý den 💚" : "Thank you for voting every day 💚")
  }

  // Event listenery
  rememberIMG.addEventListener("click", () => {
    handleVote("like")
  })

  notExperienceIMG.addEventListener("click", () => {
    handleVote("dislike")
  })



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
