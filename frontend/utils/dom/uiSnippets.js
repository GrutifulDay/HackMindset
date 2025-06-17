console.log("{uiSnippets.js} ✅ funguje")

// POMOCNE FUNKCE

/**
 * vytvori HTML element s vol. textem, stylem a atributy.
 *
 * @param {string} tag - HTML tag (např. 'div', 'a', 'p', 'img', ...)
 * @param {string|null} text - Textový obsah prvku (ne HTML)
 * @param {object} style - CSS styly jako objekt (např. { color: 'red' })
 * @param {object} attributes - Libovolné atributy (např. { src, alt, href, id, ... })
 * @param {HTMLElement} element - Element, který chceš obalit tooltipem
 * @param {string} tooltipText - Text tooltipu
 * @returns {HTMLElement} Wrapper s tooltipem
 * @param {HTMLElement} trigger Ikona, která spouští zobrazení
 * @param {HTMLElement} target Element s obsahem info boxu
 * @param {Function} [customShow] Volitelná funkce pro zobrazení (např. target.show())
 */


// style fce -  kratsi zapis 
export const setStyle = (element, styles) => {
    Object.assign(element.style, styles)
}

// cely zapis v components 
// export const el = (tag, text, style = {}) => {
//     const element = document.createElement(tag) // nazev podle html
//     if (text) element.textContent = text // pokud mam text, vlozim ho do elementu
//     setStyle(element, style)  // fce na prirazeni stylu 
//     return element    // vrati vytvoreny el. zpet 
// }

// novy zapis components = rozsirena verze bez tooltip
// export const el = (tag, text, style = {}, attributes = {}) => {
//  const element = document.createElement(tag);

//  if (text) element.textContent = text;

//  Object.assign(element.style, style);

//  Object.entries(attributes).forEach(([key, value]) => {
//    element[key] = value;
//  });

//  return element;
// }


// novy zapis components = rozsirena verze tooltip
export const el = (tag, text, style = {}, attributes = {}) => {
  const element = document.createElement(tag);

  if (text) element.textContent = text;
  Object.assign(element.style, style);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith("data-") || key === "aria-label" || key.includes("-")) {
      element.setAttribute(key, value); // pro atributy jako data-tooltip
    } else if (key === "class") {
      element.className = value
    } else {
      element[key] = value; // klasické DOM vlastnosti
    }
  });

  return element
}

// wrap s tooltipem 
export function createTooltipElement(tag, text, style = {}, attributes = {}, tooltipText = "") {
  const inner = el(tag, text, style, attributes);

  // obrázek nebo prvek uvnitř obalu
  inner.style.pointerEvents = "none"; // aby klik fungoval na wrapperu

  const wrapper = el("div", null, {
    display: "inline-block",
    position: "relative",
    cursor: "pointer"
  }, {
    class: "tooltip-wrapper",
    "data-tooltip": tooltipText
  });

  wrapper.appendChild(inner);
  return wrapper;
}

// delici cara 
export function createFadeLine() {
  return el("div", null, {
    height: "2px",
    width: "100%",
    background: "linear-gradient(to right, transparent, #000, transparent)",
    // margin: "5px 0"
    marginBottom: "10px",
    marginTop: "10px"
  }, {
    class: "fade-line"
  })
}

// fce pro otevirani oken 
export function attachInfoToggle(trigger, target, customShow) {
  const handleOutsideClick = (event) => {
    if (!target.contains(event.target) && event.target !== trigger) {
      target.style.display = "none"
      document.removeEventListener("click", handleOutsideClick)
    }
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = target.style.display === "block";
    if (isVisible) {
      target.style.display = "none"
      document.removeEventListener("click", handleOutsideClick)
    } else {
      if (customShow) {
        customShow()
      } else {
        target.style.display = "block"
      }
      setTimeout(() => document.addEventListener("click", handleOutsideClick), 0)
    }
  })
}