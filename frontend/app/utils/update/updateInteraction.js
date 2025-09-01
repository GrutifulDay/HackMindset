/**
 * @param {string[]} keys 
 */

export function clearOldInteractions(keys = []) {
    const today = new Date().toISOString().slice(0, 10)
  
    keys.forEach((key) => {
      const dateKey = `${key}_date`
      const storedDate = localStorage.getItem(dateKey)
  
      if (storedDate !== today) {
        localStorage.removeItem(key);
        localStorage.setItem(dateKey, today)
      }
    })
}

