import { fetchRetroMachine } from "../fetch/fetchRetroMachine.js";
import { el, createFadeLine } from "../utils/dom/uiSnippets.js";
import { getLanguage } from "../utils/language/language.js";
import { createModemSound } from "./sound_section/modem.js";

console.log("{retroMachine.js} 🧩 sekce se generuje...");

export async function createRetroMachine() {
  console.log("{funkce createRetroMachine} ✅ funguje");

  const lang = getLanguage();
  const retroData = await fetchRetroMachine()

  if (!retroData) {
    console.warn("❌ Žádný retro příběh nenalezen")
    console.log("🔍 retroData:", retroData);
    return;
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


  // fce Sound 
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
    width: "57px",
    cursor: "pointer"
  }, {
    src: "../assets/icons/vedel-white.png",
    title: lang === "cz" ? "Tohle si pamatuju!" : "I remember this!",
    class: "vote-img",
  })

  const notExperienceIMG = el("img", null, {
    width: "57px",
    cursor: "pointer"
  }, {
    src: "../assets/icons/nevedel-white.png",
    title: lang === "cz" ? "Tohle jsem nezažil/a!" : "I didn’t experience this!",
    class: "vote-img",
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

  const rememberWrapper = createVoteElement(rememberIMG, rememberCount)
  const notExperienceWrapper = createVoteElement(notExperienceIMG, notExperienceCount)
  feedbackWrapper.append(rememberWrapper, notExperienceWrapper)

  const voteKey = "dailyVote";
  const todayKey = new Date().toISOString().split("T")[0]
  let votes = {
    remember: 0,
    notExperience: 0
  }

  let savedVotes = JSON.parse(localStorage.getItem("voteCounts")) || {}

  // vymaze stare hlasy 
  for (const key in savedVotes) {
    if (key !== todayKey) {
      delete savedVotes[key]
    }
  }

  if (savedVotes[todayKey]) {
    votes = savedVotes[todayKey]
    rememberCount.textContent = `${votes.remember}`
    notExperienceCount.textContent = `${votes.notExperience}`
    rememberCount.style.display = "inline"
    notExperienceCount.style.display = "inline"
  }

  localStorage.setItem("voteCounts", JSON.stringify(savedVotes))

  function disableVoting(option) {
    rememberIMG.style.pointerEvents = "none"
    notExperienceIMG.style.pointerEvents = "none"

    if (option === "remember") {
      rememberIMG.src = "../assets/icons/vedel-green.png"
      rememberIMG.style.opacity = "1"
      notExperienceIMG.style.opacity = "0.4"
    } else {
      notExperienceIMG.src = "../assets/icons/nevedel-green.png"
      notExperienceIMG.style.opacity = "1"
      rememberIMG.style.opacity = "0.4"
    }
  }

  function handleVote(option) {
    const voted = JSON.parse(localStorage.getItem(voteKey))
    if (voted?.date === todayKey) {
      alert("Hlasovat můžeš jen jednou denně.")
      return;
    }

    votes[option]++
    savedVotes[todayKey] = votes

    localStorage.setItem("voteCounts", JSON.stringify(savedVotes))
    localStorage.setItem(voteKey, JSON.stringify({
      date: todayKey,
      votedFor: option
    }))

    rememberCount.textContent = `${votes.remember}`
    notExperienceCount.textContent = `${votes.notExperience}`
    rememberCount.style.display = "inline"
    notExperienceCount.style.display = "inline"

    disableVoting(option);
  }

  rememberIMG.addEventListener("click", () => {
    handleVote("remember")
  });

  notExperienceIMG.addEventListener("click", () => {
    handleVote("notExperience")
  })

  // pokud uzivatel hlasoval 
  const votedToday = JSON.parse(localStorage.getItem(voteKey))
  if (votedToday?.date === todayKey) {
    disableVoting(votedToday.votedFor)
    rememberCount.textContent = `${votes.remember}`
    notExperienceCount.textContent = `${votes.notExperience}`
    rememberCount.style.display = "inline"
    notExperienceCount.style.display = "inline"
  }

  article.append(
    createFadeLine(),
    retroWrapper,
    year,
    title,
    nostalgiggle,
    feedbackWrapper
  )

  return article;
}
