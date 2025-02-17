// NASA API - IMG DNE aktualizace kazdy den
document.addEventListener("DOMContentLoaded", function () {
    const nasaApi = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC'
    
    fetch(nasaApi)
      .then(response => response.json())
      .then(data => {
          const nasaDescription = document.getElementById('nasaDescription')
          
          if (data.media_type === "image") {
              document.getElementById('nasaImage').src = data.url
  
              // Zkrácení textu na max 30 znaků
              const fullText = data.explanation
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
              nasaDescription.textContent = 'Today is not picture, but video 🎥. Click 👇'
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

  