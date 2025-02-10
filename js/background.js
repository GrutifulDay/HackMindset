chrome.action.onClicked.addEventListener(async (tab) => {
   if (tab.url.includes("instagram.com")) {
        console.log("jsi na insta");
   }
})