import { API } from "../utils/config.js"

console.log("{fetchPostUntruthVotes.js} 📡 načten")

/**
 * Odeslání hlasování o nepravdivé informaci
 * @param {String} date - např. "10-07-2025"
 * @param {Array<String>} feedback - pole označených bodů (např. ["Rok je špatně"])
 * @returns {Object|null} - odpověď ze serveru nebo null při chybě
 */

export async function fetchPostUntruthVotes(date, feedback, section) {
  try {
    const response = await fetch(API.untruthVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer HACK_EXTENSION"
      },
      body: JSON.stringify({ date, feedback, section })
    })

    return await response.json()
  } catch (error) {
    console.error("❌ Chyba při odesílání untruth feedback:", error)
    return null
  }
}
