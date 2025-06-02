console.log("⏱️ BACKGROUND běží správně!")

// ✅ Posílá zprávu do content.js po načtení stránky s Instagramem
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (
//     changeInfo.status === "complete" &&
//     tab.url &&
//     tab.url.includes("instagram.com")
//   ) {
//     console.log("✅ Uživatel otevřel Instagram");
//     chrome.tabs.sendMessage(tabId, { action: "showContent" });
//   }
// });

// ✅ Instalace nebo aktualizace rozšíření
chrome.runtime.onInstalled.addListener(() => {
  console.log("🔄 Rozšíření bylo nainstalováno nebo aktualizováno.");

  // ⏱️ Alternativa k onStartup – spustí alarm hned po instalaci
  chrome.alarms.create("startAlarm", { when: Date.now() + 1 });
});

// ✅ Alarm po spuštění rozšíření
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "startAlarm") {
    console.log("👍 Rozšíření bylo spuštěno");
  }

  if (alarm.name === "checkUpdates") {
    console.log("💻 Čas na kontrolu aktualizací");
    // Tady můžeš spustit např. kontrolu API, nové zprávy apod.
  }
});

// ✅ Pravidelný alarm každých 60 minut
chrome.alarms.create("checkUpdates", {
  delayInMinutes: 1,
  periodInMinutes: 60
});



// NASTAVIT 


// kontrola jestli posle zpravu do content.js
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.url && tab.url.includes("instagram.com")) {
//         console.log("✅ Uživatel otevřel Instagram")
//         chrome.tabs.sendMessage(tabId, { action: "showContent" })
//     }
// })

// // Aktualizace / instalace novych fci
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("🔄 Rozšíření bylo nainstalováno nebo aktualizováno.")
// })

// // Alternativa k onStartup v Service Worker (V3)
// // Spousti alarm 
// chrome.alarms.create("startAlarm", { when: Date.now() + 1 })

// chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === "startAlarm") {
//         console.log("👍 Rozšíření bylo spuštěno")
//     }
// })

// // Sleduje, kdy uživatel otevře Instagram
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.url && tab.url.includes("instagram.com")) {
//         console.log("✅ Uživatel OTEVREL Instagram")

//         chrome.tabs.sendMessage(tabId, { action: "showContent" })
//     }
// })

// // Spustí časovač a opakuje po 60 min
// chrome.alarms.create("checkUpdates", {
//     delayInMinutes: 1,
//     periodInMinutes: 60
// })

// chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === "checkUpdates") {
//         console.log("💻 Čas na kontrolu aktualizací")
//     }
// })
