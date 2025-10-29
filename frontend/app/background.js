import { debug, warn } from "./utils/logger/.js"

// Listener na insta 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("instagram.com")
  ) {
    debug("✅ Uživatel otevřel Instagram")

    chrome.storage.local.get("preferredLanguage", (data) => {
      const lang = data.preferredLanguage || "cz"

      chrome.tabs.sendMessage(
        tabId,
        { type: "hackmindset_reminder", lang: lang },
        (response) => {
          if (chrome.runtime.lastError) {
            warn("⚠️ Nepodařilo se doručit zprávu:", chrome.runtime.lastError.message);
          } else {
            debug("✅ Zpráva byla doručena.");
          }
        }
      )
    })
  }
})


// // Volání honeypointu – bez osobních údajů
// fetch("https://localhost:3000/api/feedbackForm", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": "Bearer HACK_EXTENSION"
//   },
//   body: JSON.stringify({
//     context: "extension-check",
//     timestamp: Date.now()
//   })
// })
// .then(res => res.json())
// .then(data => {
//   debug("✅ Honeypoint odpověděl:", data.message)
// })
// .catch(err => {
//   console.warn("❌ Honeypoint fetch selhal:", err.message)
// })

