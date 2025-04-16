# HeckMindset – Frontend (Chrome Extension)

> HeckMindset nabizí: Vědomé narušení algoritmů, edukativních a doufám, že i trochu zabavné informace a všeobecný přehled, tak, jak se ve školách neučí. 

## 🧠 O projektu

HeckMindset je nezávislé rozšíření pro prohlížeč, které každý den přináší porci inspirace, nostalgie a poznání – bez reklam, bez trackingu, bez algoritmické manipulace.

Tato repozitovaná část obsahuje pouze **frontend** (kód, který běží přímo v prohlížeči uživatele).  
Rozšíření je psané v čistém JavaScriptu a je plně funkční offline, s dynamickým obsahem načítaným z backendového API.

Backend není součástí tohoto veřejného repozitáře. Slouží k:
- načítání dat (např. NASA API, historické příběhy),
- správě obsahu podle data/jazyka,
- ukládání uživatelského nastavení.

> 🔒 Backend, zabezpečení a datová logika jsou dostupné na vyžádání (např. v rámci výběrového řízení, konzultace nebo auditu).

---

## 📁 Struktura projektu

---

## 🛠 Technologie

- Manifest V3 (Chrome Extension API)
- Vanilla JavaScript
- `chrome.storage` pro lokální cache
- `fetch()` pro komunikaci s API

---

## 🧪 Testování

Pro lokální testování v Chrome:

1. Otevři `chrome://extensions`
2. Zapni režim pro vývojáře (Developer Mode)
3. Klikni na „Načíst rozbalený“ (Load unpacked)
4. Vyber složku `/frontend`

> Pro funkční fetch dat je nutné mít spuštěný vlastní backend (není veřejně dostupný).

---

## 🤝 Možnosti spolupráce

HeckMindset je osobní projekt, který vznikl s důrazem na kvalitu a respekt k uživateli.  
Pokud tě projekt zaujal, rád(a) se pobavím o:
- spolupráci,
- bezpečnostním review,
- nebo potenciálním rozšíření funkcí.

Stačí napsat.

---

## ⚖️ Licence

Frontend kód je otevřený pro studium a inspiraci.  
Jakékoli kopírování nebo přebírání jako komerčního produktu bez souhlasu autora není povoleno.

---




