export async function createLanguage() {
    console.log("{language.js}✅ Language sekce se generuje...");

    const navigation = document.createElement("nav");
    navigation.style.display = "flex";
    navigation.style.justifyContent = "space-between";
    navigation.style.alignItems = "center";
    navigation.style.padding = "0 10px";

    const language = document.createElement("p");
    language.textContent = "🇨🇿";
    language.style.fontSize = "24px";
    language.style.margin = "0"; // odstraníme mezery navíc

    const disclaimer = document.createElement("p");
    disclaimer.textContent = "ℹ️";
    disclaimer.style.fontSize = "24px";
    disclaimer.style.margin = "0";

    navigation.appendChild(language);
    navigation.appendChild(disclaimer);

    return navigation;
}
