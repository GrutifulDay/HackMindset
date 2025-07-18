import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";
import { fetchUntruthVotes } from "../../fetch/fetchUntruthVotes.js";
import { fetchUntruthLimit } from "../../fetch/fetchUntruthLimit.js";
import { increaseUntruthVote, initUntruthLimit } from "../../utils/cache/untruthLimit.js";
import { createFeedbackUntruth } from "../interactions_users/votingReport.js";

export function createUntruthVotingWindow() {
  const lang = getLanguage()

  const container = el("div", null, {
    position: "absolute",
    padding: "15px",
    zIndex: "1000",
    maxWidth: "300px",
    display: "none",
    backgroundColor: "#f7f3ff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    fontFamily: "'JetBrains Mono', monospace",
  })

  const closeBtn = el("span", "×", {
    position: "absolute",
    top: "5px",
    right: "10px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333"
  })

  function closeContainer() {
    container.style.display = "none";
    document.removeEventListener("click", handleOutsideClick)
  }

  function handleOutsideClick(e) {
    if (!container.contains(e.target)) {
      closeContainer()
    }
  }

  closeBtn.addEventListener("click", closeContainer)

  const title = el("h3", lang === "cz"
    ? "Chceš něco označit jako nepravda?"
    : "Do you want to label something as untrue?", {
    display: "block",
    marginTop: "14px",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#273E64"
  })

  const message = el("p", lang === "cz"
    ? "Pokud si myslíš, že tento článek není pravdivý, označ konkrétní části."
    : "If you think this article isn't true, select specific parts below.", {
    marginTop: "8px",
    color: "#273E64",
    fontSize: "1em"
  })

  const listItems = [
    lang === "cz" ? "Rok je špatně" : "The year is wrong",
    lang === "cz" ? "Není to dnešní datum" : "This is not today's date",
    lang === "cz" ? "Událost se stala jinak" : "It happened differently",
    lang === "cz" ? "Celý článek je špatně" : "The entire story is incorrect"
  ]

  const selectedStates = []
  const listWrapper = el("div", null, {
    marginTop: "12px",
    fontSize: "1em",
    color: "#05054e"
  })

  listItems.forEach(text => {
    const isSelected = { value: false }

    const icon = el("img", null, {
      width: "20px",
      height: "20px",
      cursor: "pointer"
    }, {
      src: "../assets/icons/mark-off.svg",
      alt: "select icon"
    })

    icon.addEventListener("click", () => {
      isSelected.value = !isSelected.value;
      icon.src = isSelected.value
        ? "../assets/icons/mark-on.svg"
        : "../assets/icons/mark-off.svg";
    })

    const label = el("span", text, {
      marginLeft: "10px"
    })

    const row = el("div", null, {
      display: "flex",
      marginBottom: "6px",
      marginLeft: "54px"
    })

    row.append(icon, label);
    listWrapper.appendChild(row);
    selectedStates.push({ text, isSelected })
  })

  const submitButton = el("button", lang === "cz" ? "Odeslat" : "Submit", {}, {
    class: "untruth-btn"
  })

  initUntruthLimit()

  // otevreni okna 
  container.show = function (referenceElement, metadata = {}) {
    container.dataset.section = metadata.section || "unknown"
    container.dataset.date = metadata.date || ""
    container.style.display = "block"
  
    // ✅ kontrola, jestli už bylo odesláno dnes
    const section = container.dataset.section
    const date = container.dataset.date
    const today = new Date().toISOString().slice(0, 10)
    const voteKey = `untruth-${section}-${date}-${today}`
  
    const alreadySubmitted = localStorage.getItem(voteKey) === "1"
  
    if (alreadySubmitted) {
      submitButton.disabled = true
      submitButton.textContent = lang === "cz" ? "Odesláno" : "Submitted"
      submitButton.style.opacity = "0.6"
    } else {
      submitButton.disabled = false
      submitButton.textContent = lang === "cz" ? "Odeslat" : "Submit"
      submitButton.style.opacity = "1"
    }
  
    // pozice leva / prava stejna vzdalenost od ikony 
    requestAnimationFrame(() => {
      const rect = referenceElement.getBoundingClientRect()
    
      const top = window.scrollY + rect.top - container.offsetHeight - 5
      const screenCenter = window.innerWidth / 2
      const left = rect.left < screenCenter
        ? window.scrollX + rect.right + 5
        : window.scrollX + rect.left - container.offsetWidth - 5
    
      container.style.top = `${top}px`
      container.style.left = `${left}px`
    
      // 🟣 scroll nahoru, kdyz neni videt cely okno 
      requestAnimationFrame(() => {
        const rectContainer = container.getBoundingClientRect()
    
        if (rectContainer.top < 0 || rectContainer.bottom > window.innerHeight) {
          container.scrollIntoView({
            behavior: "smooth",   // plynuly 
            block: "start"    // center do stredu 
          })
        }
      })
      document.addEventListener("click", handleOutsideClick)
      console.log("✅ Zobrazovací funkce FINÁLNĚ nastavila pozici.")
    })
    
  }
  
    submitButton.addEventListener("click", async () => {
    const section = container.dataset.section
    const date = container.dataset.date

    const selected = selectedStates
      .filter(item => item.isSelected.value)
      .map(item => item.text);

    if (selected.length === 0 || !date) return;

    const today = new Date().toISOString().slice(0, 10)
    const month = date.slice(0, 7)

    const voteKey = `untruth-${section}-${date}-${today}`
    const abuseKey = `abuse-limit-${section}-${month}`

    // Zneuziti = vsechno zaskrtnuto
    const isAbuse = selected.length === 4

    // Pokud uz v tomhle mesici poslal zneuziti, nepridavat znova
    if (isAbuse) {
      if (!localStorage.getItem(abuseKey)) {
        await fetchUntruthLimit( section, date ) // +1 v DB
        localStorage.setItem(abuseKey, "1")
        createFeedbackUntruth(lang === "cz"
          ? "Díky. Tvůj podnět byl zaznamenán 👍"
          : "Thanks. Your report was recorded. 👍"
        )
      } else {
        console.log("📛 Zneužití už bylo tento měsíc zaznamenáno")
      }
    } else {
      // Platny bezny hlas
      await fetchUntruthVotes(date, selected, section)
      increaseUntruthVote()
      createFeedbackUntruth(lang === "cz"
        ? "Děkujeme za nahlášení chyby 👍"
        : "Thank you for reporting the error. 👍"
      )
    }

    localStorage.setItem(voteKey, "1")

    submitButton.disabled = true
    submitButton.textContent = lang === "cz" ? "Odesláno" : "Submitted"
    submitButton.style.opacity = "0.6"
  })

  container.append(
    closeBtn,
    title,
    message,
    listWrapper,
    submitButton
  )

  return container
}
