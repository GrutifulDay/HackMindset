import { API } from "../utils/config.js"

/**
 * @param {String} date 
 * @param {Array<String>} feedback 
 * @returns {Object|null} 
 */

export async function fetchUntruthVotes(date, feedback, section) {
  try {
    const response = await fetch(API.untruthVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Tag": "HACK_EXTENSION"
      },
      body: JSON.stringify({ 
        date, 
        feedback, 
        section 
      })
    })

    return await response.json()
  } catch (error) {
    console.error("❌ Chyba při odesílání untruth feedback:", error)
    return null
  }
}
