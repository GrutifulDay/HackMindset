import { API } from "../utils/config.js";

export async function fetchGetVoteStory(date) {
  try {
    const response = await fetch(`${API.storyVotesGet}/${date}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer HACK_EXTENSION",
      },
    });

    return await response.json();
  } catch (error) {
    return { like: 0, dislike: 0 };
  }
}

export async function fetchPostVoteStory(date, option) {
  try {
    const response = await fetch(API.storyVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer HACK_EXTENSION",
      },
      body: JSON.stringify({ date, option }),
    });

    return await response.json();
  } catch (error) {
    return null;
  }
}
