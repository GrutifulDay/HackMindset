import { DEV_MODE } from "../config.js";

export function getCachedData(cacheKey) {
  if (DEV_MODE) {
    localStorage.removeItem(cacheKey);
    return null;
  }

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    const today = new Date().toISOString().slice(0, 10);

    if (parsed.date !== today) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.data;
  } catch (e) {
    localStorage.removeItem(cacheKey);
    return null;
  }
}

export function setCachedData(cacheKey, data) {
  const todayDate = new Date().toISOString().slice(0, 10);
  const toSave = {
    data,
    timestamp: Date.now(),
    date: todayDate,
  };
  localStorage.setItem(cacheKey, JSON.stringify(toSave));
}
