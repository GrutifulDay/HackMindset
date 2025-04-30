console.log("{likeButton.js} 👍 je načtený");

// UPRAVIT - ZKRATIT 
export async function likeButton() {
  console.log("{funkce likeButton} ✅ funguje")

  const button = document.createElement("button");
  const count = document.createElement("span");
  const container = document.createElement("div");

  const clickedKey = "retro_liked";
  const alreadyClicked = localStorage.getItem(clickedKey) === "true";

  button.textContent = "👍";
  button.disabled = alreadyClicked;
  button.style.opacity = alreadyClicked ? "0.6" : "1";

  const fetchCount = async () => {
    const res = await fetch("http://localhost:3000/api/likes");
    const data = await res.json();
    count.textContent = data.count;
  };

  button.addEventListener("click", async () => {
    if (alreadyClicked) return;

    const res = await fetch("http://localhost:3000/api/likes", {
      method: "POST",
    });

    const data = await res.json();
    count.textContent = data.count;
    localStorage.setItem(clickedKey, "true");
    button.disabled = true;
    button.style.opacity = "0.6";
  });

  await fetchCount();

  Object.assign(button.style, {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  });

  Object.assign(container.style, {
    display: "flex",
    alignItems: "center",
    gap: "10px"

  })
  
  // 📌 pridani prvku do sekce - podle poradi 
  container.append(button, count)
  
  return container;
}
