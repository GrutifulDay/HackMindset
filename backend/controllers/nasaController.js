import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import {
  FETCH_API_NASA,
  API_KEY_NASA,
  NASA_FALLBACK,
  NASA_ARCHIVE,
  NASA_BASE_URL
} from "../config.js";

// ukladani do cache (RAM)
let nasaCache = null;
let nasaCacheDate = null;

// 🔢 stejny img pro vsechny na jeden den z archivu 
function getDailyIndex(linksLength) {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / 86400000);
  const seed = year * 1000 + dayOfYear;
  return seed % linksLength;
}

function isToday(dateString) {
  if (!dateString) return false;
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
}

export async function fetchNasaImage(req, res) {
  const today = new Date().toISOString().slice(0, 10);

  // kontrola backend cache
  if (nasaCache && nasaCacheDate === today) {
    console.log("⚡ NASA backend cache – posílám uložená data");
    if (req.internal) return; // 🟢 důležité pro cron – nevrací JSON
    return res.json(nasaCache);
  }

  try {
    // pokus o NASA API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const apiUrlNasa = `${FETCH_API_NASA}${API_KEY_NASA}`;
    const response = await fetch(apiUrlNasa, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Chyba NASA API: ${response.status}`);

    const data = await response.json();

    if (isToday(data.date)) {
      const result = {
        type: data.media_type,
        url: data.url,
        explanation: data.explanation,
        date: data.date,
        source: "api",
        pageUrl: data.hdurl || "https://apod.nasa.gov/apod/astropix.html"
      };
      nasaCache = result;
      nasaCacheDate = today;
      if (req.internal) return result;
      return res.json(result);
    }

    console.warn(`⚠️ NASA API má staré datum (${data.date}) – přepínám na archiv.`);
    throw new Error("Staré datum v API");

  } catch (error) {
    console.warn("⚠️ NASA API nedostupné nebo neaktuální – zkouším fallback...");

    // fallback HTML
    try {
      const htmlResponse = await fetch(NASA_FALLBACK);
      const html = await htmlResponse.text();
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const img = doc.querySelector("img");
      const explanation = doc.querySelector("p")?.textContent || "Bez popisu.";
      const dateText = doc.querySelector("b")?.textContent || "";
      const url = `${NASA_BASE_URL}${img?.getAttribute("src")}`;

      if (!dateText.includes(new Date().getFullYear())) {
        console.warn("⚠️ Fallback HTML nemá dnešní datum – archivní režim.");
        throw new Error("Fallback stale");
      }

      const result = {
        type: "image",
        url,
        explanation,
        date: dateText,
        source: "fallback"
      };
      nasaCache = result;
      nasaCacheDate = today;
      return res.json(result);

    } catch {
      // archivni rezim

      try {
        const archiveRes = await fetch(NASA_ARCHIVE);
        const archiveHtml = await archiveRes.text();
        const archiveDom = new JSDOM(archiveHtml);
        const links = [
          ...archiveDom.window.document.querySelectorAll("a[href^='ap']")
        ];

        if (!links.length) throw new Error("Archivní odkazy nenalezeny");

        const index = getDailyIndex(links.length);
        const randomLink = links[index].getAttribute("href");
        const randomUrl = `${NASA_BASE_URL}${randomLink}`;
        const randomPageRes = await fetch(randomUrl);
        const randomHtml = await randomPageRes.text();
        const randomDom = new JSDOM(randomHtml);
        const randomDoc = randomDom.window.document;

        const img = randomDoc.querySelector("img");
        const explanation =
          randomDoc.querySelector("p")?.textContent ||
          "Popis není dostupný.";

          const result = {
            type: "image",
            url: `${NASA_BASE_URL}${img?.getAttribute("src")}`,
            explanation,
            date: "Archivní výběr",
            source: "archive-random",
            pageUrl: randomUrl // ✅ klíčové
          };
          
        nasaCache = result;
        nasaCacheDate = today;
        return res.json(result);

      } catch (archiveError) {
        console.error("❌ NASA archiv selhal:", archiveError.message);
        return res
          .status(502)
          .json({ error: "NASA API i archiv momentálně nedostupné." });
      }
    }
  }
}
