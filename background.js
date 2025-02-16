document.addEventListener("DOMContentLoaded", () => {
    // 🔵 Kontrola Seznam.cz
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url?.includes("seznam.cz")) {
        document.getElementById("message").textContent = "Jsi na Seznam.cz!";
      } else {
        document.getElementById("message").textContent = "Nejsi na Seznam.cz.";
      }
    });
  
    // 🔵 NASA API - Aktualizace každý den nový obrázek
    const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const nasaDescription = document.getElementById('nasaDescription');
        const nasaImage = document.getElementById('nasaImage');
  
        if (data.media_type === "image") {
          nasaImage.src = data.url;
          const fullText = data.explanation;
          const shortText = fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;
  
          nasaDescription.textContent = shortText;
          nasaDescription.style.cursor = "pointer";
  
          nasaDescription.addEventListener("click", () => {
            nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText;
          });
  
          // 🔵 Zvětšení NASA obrázku po kliknutí
          nasaImage.addEventListener("click", () => {
            nasaImage.classList.toggle("zoomed");
          });
  
        } else {
          nasaDescription.textContent = 'Dnes není obrázek, ale video 🎥. Klikni 👇';
        }
      })
      .catch(err => {
        console.error('Chyba při načítání obrázku z NASA API:', err);
        document.getElementById('nasaDescription').textContent = 'Nepodařilo se načíst obrázek dne.';
      });
  

  