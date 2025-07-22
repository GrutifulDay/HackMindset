import { el, createFadeLine, attachInfoToggle } from "../utils/dom/uiSnippets.js";
import { createTranslationInfoWindow } from "./info_icons/translationInfo.js";
import { createTranslationIcon } from "./icons_import/aboutTranslation.js";
import { getLanguage } from "../utils/language/language.js";
import { fetchNasaImage } from "../fetch/fetchNasa.js";
import { createAddTooltip } from "../utils/dom/tooltip.js";

export async function createNasaSection() {
  const lang = getLanguage();
  const nasaData = await fetchNasaImage();

  const section = el("section", null, {}, {});

  const titleWrapper = el("div", null, {
    position: "relative",
    marginTop: "10px",
  });

  const rocketIcon = el(
    "img",
    null,
    {
      width: "42px",
      height: "auto",
      position: "absolute",
      top: "-11px",
      left: "-8px",
      opacity: ".8",
    },
    {
      src: "../assets/icons/rocket.svg",
    }
  );

  const nasaTitle = el("h2", null);
  const title = document.createTextNode("Astronomy Picture of the Day by ");

  const link = el(
    "a",
    "NASA",
    {
      color: "#3b77d0",
      fontWeight: "bold",
    },
    {
      href: "https://www.nasa.gov",
      target: "_blank",
      className: "nasa-link",
      rel: "noopener noreferrer",
    }
  );

  createAddTooltip(link, "nasa.gov");

  nasaTitle.append(title, link);
  titleWrapper.append(rocketIcon, nasaTitle);

  const nasaImage = el(
    "img",
    null,
    {
      width: "45%",
      borderRadius: "1.2em",
      border: ".3em solid #f5e9da",
      boxShadow: "0 0 20px rgba(78, 112, 166, 0.6)",
    },
    {
      src: nasaData.url,
      alt: "Astronomy Picture of the Day",
    }
  );

  const descriptionWrapper = el("div", null, {
    position: "relative",
    marginTop: "10px",
  });

  const translationIcon = createTranslationIcon();
  const translationInfoIcon = createTranslationInfoWindow();

  attachInfoToggle(translationIcon, translationInfoIcon, () => translationInfoIcon.show());

  const fullText = nasaData.explanation;
  const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;

  const nasaDescription = el(
    "p",
    shortText,
    {
      cursor: "pointer",
      fontFamily: "`JetBrains Mono`",
    },
    {
      className: "nasa-description",
    }
  );

  nasaDescription.addEventListener("click", () => {
    nasaDescription.textContent = nasaDescription.textContent === shortText ? fullText : shortText;
  });

  if (lang !== "en") {
    descriptionWrapper.append(translationIcon);
  }
  descriptionWrapper.append(nasaDescription);

  const moreText = lang === "cz" ? "Chceš vědět víc?" : "Want to know more?";

  const nasaLink = el(
    "a",
    moreText,
    {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
    },
    {
      href: "https://apod.nasa.gov/apod/astropix.html",
      target: "_blank",
      className: "nasa-url",
      rel: "noopener noreferrer",
    }
  );

  const moreIcon = el(
    "img",
    null,
    {
      width: "12px",
      height: "auto",
    },
    {
      src: "../assets/icons/more.svg",
    }
  );

  nasaLink.append(moreIcon);

  section.append(
    createFadeLine(),
    titleWrapper,
    nasaImage,
    descriptionWrapper,
    translationInfoIcon,
    nasaLink
  );
  return section;
}
