import { el } from "../../utils/dom/uiSnippets.js";
import { getLanguage } from "../../utils/language/language.js";

export function createAboutExtensionWindow() {
  const lang = getLanguage();

  const texts = {
    cz: {
      title: "O rozšíření",
      line1:
        "HeckMindset přináší několik tichých denních zastavení – o vesmíru, historii, technologiích a jednoduchých tipech, jak se zorientovat v digitálním světě.",
      line2: "Každá sekce má svůj jasný smysl:",
      line3:
        "NASA obrázek dne – připomínka toho, co se děje mimo naši planetu. Malé okno do světa vědy a objevování vesmíru.",
      line4: "Digitální průvodce – jednoduché rady, jak být online v bezpečí a v obraze.",
      line5:
        "Příběh dne – skutečná historická událost propojená s dnešním datem, stručně a s kontextem.",
      line6:
        "Retro Machine – návrat k tomu, jak se technologie vyvíjela od 70. let až do současnosti, skrze konkrétní zařízení a vzpomínky.",
      line7:
        "Insta Tipy – vybrané edukační a inspirativní Instagram profily, rozdělené do oblastí:",
      line8: "vesmír a poznání",
      line9: "příroda, cestování a divočina",
      line10:
        "Věškeré hlasování je zcela anonymní, nesbírám cookies, IP adresy atd, jde jen o statistiku",
    },
    en: {
      title: "About Extension",
      line1:
        "HeckMindset brings a few quiet daily moments – about space, history, technology, and simple tips to stay oriented in the digital world.",
      line2: "Each section has a clear purpose:",
      line3:
        "NASA Image of the Day – a reminder of what’s happening beyond our planet. A small window into science and space exploration.",
      line4: "Digital Guide – simple advice on how to stay safe and aware online.",
      line5:
        "Story of the Day – a real historical event connected to the current date, written briefly and with context.",
      line6:
        "Retro Machine – a look back at how technology evolved from the 1970s to today, through specific devices and memories.",
      line7: "Insta Tips – selected educational and inspiring Instagram profiles, grouped into:",
      line8: "space & learning",
      line9: "nature, travel & wildlife",
      line10:
        "Věškeré hlasování je zcela anonymní, nesbírám cookies, IP adresy atd, jde jen o statistiku",
    },
  };

  const t = texts[lang] || texts.en;

  const container = el(
    "div",
    null,
    {
      position: "absolute",
      top: "36px",
      right: "32px",
      backgroundColor: "#ffe5f0",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: "1000",
      maxWidth: "300px",
      display: "none",
    },
    {
      id: "info-panel",
    }
  );

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
  function handleOutsideClick(e) {
    if (!container.contains(e.target)) {
      closeContainer();
    }
  }

  closeBtn.addEventListener("click", closeContainer);

  container.show = function () {
    container.style.display = "block";
    // prodleva
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  };

  const title = el("strong", t.title);
  const lines = [
    t.line1,
    t.line2,
    t.line3,
    t.line4,
    t.line5,
    t.line6,
    t.line7,
    t.line8,
    t.line9,
    t.line10,
  ]
    .filter(Boolean)
    .map((text) => el("p", text));

  const footer = el("footer", null, {});

  const gitHubLink = el(
    "a",
    null,
    {
      display: "inline-block",
    },
    {
      href: "https://github.com/GrutifulDay/HackMindset.git",
      target: "_blank",
      rel: "noopener noreferrer",
    }
  );

  const gitHubIcon = el(
    "img",
    null,
    {
      width: "40px",
      height: "auto",
      cursor: "pointer",
    },
    {
      src: "../assets/icons/github.svg",
      title: "GitHub",
    }
  );

  gitHubLink.append(gitHubIcon);
  footer.append(gitHubLink);
  container.append(closeBtn, footer, title, ...lines);
  return container;
}
