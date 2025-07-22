import { el } from "../../utils/dom/uiSnippets.js";

export function createTranslationInfoWindow() {
  const container = el("div", null, {
    position: "absolute",
    bottom: "102px",
    right: "47px",
    padding: "15px",
    zIndex: "1000",
    maxWidth: "300px",
    display: "none",

    backgroundColor: "#fff8e1",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  });

  const closeBtn = el("span", "×", {
    position: "absolute",
    top: "5px",
    right: "10px",
    cursor: "pointer",

    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  });

  function closeContainer() {
    container.style.display = "none";
    document.removeEventListener("click", handleOutsideClick);
  }

  closeBtn.addEventListener("click", closeContainer);

  function handleOutsideClick(e) {
    if (!container.contains(e.target)) {
      closeContainer();
    }
  }

  container.show = function () {
    container.style.display = "block";
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  };

  const title = el("strong", "Překlad");

  const line1 = el(
    "p",
    "Jazyk je zatím možný pouze v angličtině, pokud chcěš text v čestine, klikni na odkaz >Chceš vědět víc?< a klikni na >Přeložit tuto stránku s tímto logem<."
  );

  const line2 = el("p", "...");

  container.append(closeBtn, title, line1, line2);
  return container;
}
