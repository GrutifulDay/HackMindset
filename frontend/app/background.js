// Listener na insta 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("instagram.com")
  ) {
    console.log("✅ Uživatel otevřel Instagram")

    chrome.storage.local.get("preferredLanguage", (data) => {
      const lang = data.preferredLanguage || "cz"

      chrome.tabs.sendMessage(
        tabId,
        { type: "hackmindset_reminder", lang: lang },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("⚠️ Nepodařilo se doručit zprávu:", chrome.runtime.lastError.message);
          } else {
            console.log("✅ Zpráva byla doručena.");
          }
        }
      )
    })
  }
})
