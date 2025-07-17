console.log("{language.js} ✅ funguje")


export function setLanguage(lang) {
    localStorage.setItem("preferredLanguage", lang)
    chrome.storage.local.set({ preferredLanguage: lang })
  }
  
  export function getLanguage() {
    return localStorage.getItem("preferredLanguage") || "cz"
  }
  
  export function hasLanguageSet() {
    return !!localStorage.getItem("preferredLanguage")
  }
  