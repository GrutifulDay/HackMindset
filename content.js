console.log("Content script spuštěn - posílám zprávu do background.js")

chrome.runtime.sendMessage({ onSeznam: true })
