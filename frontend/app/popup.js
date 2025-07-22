import { selectionLanguage } from "./components/onboarding/promptLanguage.js";
import { initPopup } from "./initApp.js";


function runOnboardingIfNeeded() {
  chrome.storage.local.get("onboardingCompleted", (result) => {
    const completed = result.onboardingCompleted

    if (!completed) {
      selectionLanguage()
    } else {
        initPopup()
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  runOnboardingIfNeeded()
})
