chrome.action.onClicked.addListener(async (tab) => {
   if (tab.url && tab.url.includes("instagram.com")) {
        console.log("jsi na insta");
   }
})

chrome.runtime.onInstalled.addListener(() => {
   console.log("HackMindset Extension nainstalováno.");
});
