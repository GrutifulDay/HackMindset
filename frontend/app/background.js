const shownTabs = new Set();

function alreadyShownToday(callback) {
  chrome.storage.local.get("lastReminderDate", (data) => {
    const today = new Date().toISOString().split("T")[0];
    if (data.lastReminderDate === today) {
      callback(true);
    } else {
      chrome.storage.local.set({ lastReminderDate: today }, () => callback(false));
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("instagram.com")
  ) {
    if (shownTabs.has(tabId)) return;
    shownTabs.add(tabId);

    alreadyShownToday((wasShownToday) => {
      if (wasShownToday) {
        return;
      }

      chrome.storage.local.get("preferredLanguage", (data) => {
        const lang = data.preferredLanguage || "cz";

        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { type: "hackmindset_reminder", lang }, () => {
            if (chrome.runtime.lastError) {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { type: "hackmindset_reminder", lang }, () => {
                });
              }, 3000);
            }
          });
        }, 1500);
      });
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  shownTabs.delete(tabId);
});

