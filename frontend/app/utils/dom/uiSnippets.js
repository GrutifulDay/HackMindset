/**
 * @param {string} tag
 * @param {string|null} text
 * @param {object} style
 * @param {object} attributes
 * @param {HTMLElement} element
 * @param {string} tooltipText
 * @returns {HTMLElement}
 * @param {HTMLElement} trigger
 * @param {HTMLElement} target
 * @param {Function} [customShow]
 */

export const setStyle = (element, styles) => {
  Object.assign(element.style, styles);
};

export const el = (tag, text, style = {}, attributes = {}) => {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  Object.assign(element.style, style);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith("data-") || key === "aria-label" || key.includes("-")) {
      element.setAttribute(key, value);
    } else if (key === "class") {
      element.className = value;
    } else {
      element[key] = value;
    }
  });
  return element;
};

export function createFadeLine() {
  return el(
    "div",
    null,
    {
      height: "2px",
      width: "100%",
      background: "linear-gradient(to right, transparent, #000, transparent)",
      marginBottom: "10px",
      marginTop: "10px",
    },
    {
      class: "fade-line",
    }
  );
}

export function attachInfoToggle(trigger, target, customShow) {
  const handleOutsideClick = (event) => {
    if (!target.contains(event.target) && event.target !== trigger) {
      target.style.display = "none";
      document.removeEventListener("click", handleOutsideClick);
    }
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = target.style.display === "block";
    if (isVisible) {
      target.style.display = "none";
      document.removeEventListener("click", handleOutsideClick);
    } else {
      if (customShow) {
        customShow();
      } else {
        target.style.display = "block";
      }
      setTimeout(() => document.addEventListener("click", handleOutsideClick), 0);
    }
  });
}
