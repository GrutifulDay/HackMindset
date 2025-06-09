import { DEV_MODE } from "../config.js"; // cesta podle struktury projektu

export async function updateSectionData(key) {
    const now = new Date()

    if (DEV_MODE) {
        console.warn(`[${key}] 🧪 DEV_MODE aktivní – stahuji data znovu.`);
        return true
    }

    const { lastFetch } = await new Promise((resolve) => {
        chrome.storage.local.get([`${key}_lastFetch`], (result) => {
            resolve({ lastFetch: result[`${key}_lastFetch`] })
        })
    })

    if (!lastFetch) {
        console.log(`[${key}] 📥 První fetch – data se stahují.`);
        return true
    }

    const lastFetchDate = new Date(lastFetch)

    const isDifferentDay =
        now.getFullYear() !== lastFetchDate.getFullYear() ||
        now.getMonth() !== lastFetchDate.getMonth() ||
        now.getDate() !== lastFetchDate.getDate()

    if (isDifferentDay) {
        console.log(`[${key}] 🔁 Nový den – data se aktualizují.`);
        return true
    }

    console.log(`[${key}] ✅ Data jsou aktuální.`);
    return false
}
