import { API } from "../utils/config.js"
import { getJwtToken } from "../utils/auth/jwtToken.js";
import { debug, error } from "../utils/logger/logger.js";

debug("{fetchPostUntruthVotes.js} 📡 načten")

/**
 * @param {String} date
 * @param {Array<String>} feedback 
 * @returns {Object|null}
 */

export async function fetchUntruthVotes(date, feedback, section) {

  const token = await getJwtToken() 

  if (!token) {
    error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }
  try {
    const response = await fetch(API.untruthVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        date, 
        feedback, 
        section 
      })
    })

    return await response.json()
  } catch (error) {
    error("❌ Chyba při odesílání untruth feedback:", error)
    return null
  }
}
