import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js";
import { debug, error } from "../utils/logger/logger.js";

debug("{fetchRetroVotes.js} 📡 načten");

// ziskani postu hlasu pro dany den 
export async function fetchGetVoteRetro(date) {
  const token = await getJwtToken() 

  if (!token) {
    error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }
  
  try {
    const response = await fetch(`${API.retroVotesGet}/${date}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    return await response.json()
  } catch (error) {
    error("❌ Chyba při získávání hlasů:", error);
    return { like: 0, dislike: 0 }
  }
}

// odesilani hlasu
export async function fetchPostVoteRetro(date, option) {
  const token = await getJwtToken() 

  if (!token) {
    error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }

  try {
    const response = await fetch(API.retroVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date, option })
    })

    return await response.json()
  } catch (error) {
    error("❌ Chyba při odesílání hlasu:", error);
    return null
  }
}
