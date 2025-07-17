chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "hackmindset_reminder") {
    showHackMindsetReminder(message.lang)
  }
})

function showHackMindsetReminder(lang) {
  if (document.getElementById("showContent")) return

  const message =
    lang === "en"
      ? "Have you checked today’s update in HackMindset?"
      : "Už jsi dnes viděl novinky v rozšíření HackMindset?";

  const popup = document.createElement("div");
  popup.id = "showContent";
  popup.textContent = message;

  Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#222",
    color: "#fff",
    padding: "15px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    zIndex: 9999,
    fontSize: "14px",
    maxWidth: "280px"
  })

  document.body.appendChild(popup)

  setTimeout(() => {
    popup.remove()
  }, 7000)
}
