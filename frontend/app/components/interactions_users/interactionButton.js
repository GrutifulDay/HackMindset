import { el } from "../../../utils/uiSnippets.js";

console.log("{interactionButton.js} 👍 je načtený");

export async function createInteractionButton(key, emoji, label = "") {
  console.log("{funkce createInteractionButton} ✅ funguje")

  // button
  const button = el("button", emoji, {
    fontSize: "20px",
    cursor: "pointer",
    border: "none",
    background: "none",
  })
  button.title = label

  const dateKey = `${key}_date`
  const storedDate = localStorage.getItem(dateKey)
  const today = new Date().toISOString().slice(0, 10) 

  if (storedDate !== today) {
    localStorage.removeItem(key)
    localStorage.setItem(dateKey, today)
  }

  const count = localStorage.getItem(key)
  let value = count ? parseInt(count, 10) : 0

  const span = el("span", value.toString(), {
    marginLeft: "8px",
    marginTop: "4px"
  })

  button.addEventListener("click", () => {
    value++
    localStorage.setItem(key, value)
    localStorage.setItem(dateKey, today)
    span.textContent = value
  })

  // wrapper 
  const wrapper = el("div", null, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "red",
    gap: "2px"
  })

  wrapper.append(button, span)

  return wrapper
}

