import { DEV_MODE } from "../config.js"; 

export async function updateSectionData(key, interval = "daily") {
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
      return true
    }
  
    const lastFetchDate = new Date(lastFetch)
  
    if (interval === "weekly") {
      const isNewWeek =
        now.getFullYear() !== lastFetchDate.getFullYear() ||
        getMonday(now) !== getMonday(lastFetchDate)
  
      if (isNewWeek) {
        return true
      }
      return false
    }
  
    const isDifferentDay =
      now.getFullYear() !== lastFetchDate.getFullYear() ||
      now.getMonth() !== lastFetchDate.getMonth() ||
      now.getDate() !== lastFetchDate.getDate()
  
    if (isDifferentDay) {
      return true
    }
    return false
  }
  
  function getMonday(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff)).toDateString()
  }
  