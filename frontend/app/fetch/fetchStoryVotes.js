import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js";
import { debug, error } from "../utils/logger/logger.js";

debug("{fetchStoryVotes.js} 📡 načten");

// ziskani postu hlasu pro dany den 
export async function fetchGetVoteStory(date) {
  const token = await getJwtToken() 

  if (!token) {
    error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }
  try {
    const response = await fetch(`${API.storyVotesGet}/${date}`, {
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
export async function fetchPostVoteStory(date, option) {
  const token = await getJwtToken() 

  if (!token) {
    error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }

  try {
    const response = await fetch(API.storyVotesPost, {
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
