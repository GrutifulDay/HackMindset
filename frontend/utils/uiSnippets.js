console.log("{uiSnippets.js} ✅ funguje")

/**
 * vytvori HTML element s vol. textem, stylem a atributy.
 *
 * @param {string} tag - HTML tag (např. 'div', 'a', 'p', 'img', ...)
 * @param {string|null} text - Textový obsah prvku (ne HTML)
 * @param {object} style - CSS styly jako objekt (např. { color: 'red' })
 * @param {object} attributes - Libovolné atributy (např. { src, alt, href, id, ... })
 * @returns {HTMLElement}
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

// novy zapis componens = rozsirena verze 
export const el = (tag, text, style = {}, attributes = {}) => {
 const element = document.createElement(tag);

 if (text) element.textContent = text;

 Object.assign(element.style, style);

 Object.entries(attributes).forEach(([key, value]) => {
   element[key] = value;
 });

 return element;
};