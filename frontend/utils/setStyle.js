    console.log("{funkce setStyle} ✅ funguje")

    // style fce -  kratsi zapis 
    export const setStyle = (element, styles) => {
        Object.assign(element.style, styles)
    }
