// objeveni #zajimay_obsah na zaklade stranky, na ktere je uzivatel - pozdeji casove nastavit
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]

      if (currentTab.url.includes("seznam.cz")) {
          document.getElementById("message").textContent = "Jsi na Seznam.cz!"
      } else {
          document.getElementById("message").textContent = "Nejsi na Seznam.cz."
      }
  })
})


// NASA API - IMG DNE aktualizace kazdy den
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC'
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const nasaDescription = document.getElementById('nasaDescription')
        
        if (data.media_type === "image") {
            document.getElementById('nasaImage').src = data.url

            // Zkrácení textu na max 60 znaků
            const fullText = data.explanation // Celý text
            const shortText = fullText.length > 30 
                ? fullText.slice(0, 30) + "..." 
                : fullText

          nasaDescription.textContent = shortText

          nasaDescription.addEventListener("click", () => {
            if (nasaDescription.textContent == shortText) {
              nasaDescription.textContent = fullText
            } else {
              nasaDescription.textContent = shortText
            }
          })

          nasaDescription.style.cursor = "pointer"

        } else {
            nasaDescription.textContent = 'Dnes není obrázek, ale video 🎥. Klikni 👇'
        }
    })
    .catch(err => {
        console.error('Chyba při načítání obrázku z NASA API:', err)
        document.getElementById('nasaDescription').textContent = 'Nepodařilo se načíst obrázek dne.'
    })
})

// ZVETSENI IMG PO KLIKNUTI
document.addEventListener("DOMContentLoaded", function () {
  const nasaImage = document.getElementById("nasaImage")

  nasaImage.addEventListener("click", () => {
    nasaImage.classList.toggle("zoomed")
  })
})

// goodNews clanky 















