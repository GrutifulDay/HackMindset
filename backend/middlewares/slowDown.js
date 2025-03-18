import slowDown from "express-slow-down";

const speedLimiter = slowDown ({
    windowMs: 15 * 60 * 1000, // 15 minut
    delayAfter: 10, // Po 10 requestech zpomalíme odpověď
    delayMs: 500 // Každý další request zpomalíme o 500ms
})

export default speedLimiter



