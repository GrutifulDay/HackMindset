import { el } from "../../utils/dom/uiSnippets.js";

console.log("{interactionButton.js} 👍 je načtený");

// LOGIKA INTERACTION IMG click +1 
export function createInteractionButton(imgElement, key, label) {

  const section = key.split("_")[0] // např. "retro" nebo "story"
  const voteDateKey = `${section}_vote_date`
  const voteChoiceKey = `${section}_vote_choice`
  const today = new Date().toISOString().slice(0, 10)

  const storedDate = localStorage.getItem(voteDateKey)
  const storedChoice = localStorage.getItem(voteChoiceKey)

  const countKey = key
  let count = parseInt(localStorage.getItem(countKey)) || 0

  // cisla +1 vedle img
  const span = el("span", count.toString(), {
    padding: "2px 6px",
    borderRadius: "6px",

    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f0f0f0",
  }, {
    className: "vote-count"
  })

  // hlasovani zmenit jen na +1 denne - 1 img + skryt pocet hlasu pred hlasovanim 
  imgElement.addEventListener("click", () => {
    if (storedDate === today) {
      console.log(`❌ V sekci "${section}" už bylo dnes hlasováno (${storedChoice})`);
      return
    }

    count++
    localStorage.setItem(countKey, count)
    localStorage.setItem(voteDateKey, today)
    localStorage.setItem(voteChoiceKey, key)

    span.textContent = count.toString()
    console.log(`✅ Přidáno 1 k ${key}`)
  })

  // Hover efekt - obousmerny 
  imgElement.addEventListener("mouseover", () => {
    imgElement.style.transform = "scale(1.05)"
  })
  imgElement.addEventListener("mouseout", () => {
    imgElement.style.transform = "scale(1)"
  })

  // img + cisla
  const wrapper = el("div", null, {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  })


  wrapper.append(span, imgElement)
  return wrapper
}
