// Náhodná slova pro vyhledávání
const randomWords = [
    "historie žárovek", "jak se vyrábí čokoláda", "náhodná fakta o vesmíru",
    "vývoj parních lokomotiv", "obskurní filmy 80. let", "ekosystémy v oceánech",
    "technologie budoucnosti", "nejdelší mosty světa", "neobvyklá zvířata",
    "co je kvantová fyzika", "historie knihoven", "jak funguje kávovar"
];

// Funkce pro otevření náhodného vyhledávání
function openRandomSearch() {
    const randomQuery = randomWords[Math.floor(Math.random() * randomWords.length)];
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(randomQuery)}`;

    chrome.tabs.create({ url: searchUrl });
}

// Přidání event listeneru pro tlačítko
document.getElementById("search").addEventListener("click", openRandomSearch);
