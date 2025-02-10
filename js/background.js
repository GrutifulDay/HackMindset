let timer = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("instagram.com")) {
        if (!timer) {
            console.log("Instagram otevřen – odpočet spuštěn!");
            timer = setTimeout(() => {
                showMindsetPopup();
                timer = null; // Resetovat časovač
            }, 30 * 60 * 1000); // 30 minut
        }
    } else {
        clearTimeout(timer);
        timer = null;
    }
});

function showMindsetPopup() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "HackMindset – Čas na inspiraci!",
        message: "Zkus tyto zdravé hashtagy: #LearnToCode, #SpaceDiscovery, #MentalHealth",
        buttons: [{ title: "Zobrazit hashtagy" }]
    });
}
