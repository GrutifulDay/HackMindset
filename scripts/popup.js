// let modal = document.createElement("div")
// modal.innerHTML = `
//     <div id="customAlert" class="modal">
//         <div id="modal-content">
//             <span class="close">&times;</span>
//             <button id="openContent">Heck Mindset</button>
//         </div>
//     </div>`
// document.body.appendChild(modal)

// // let section = document.createElement("div")
// // section.innerHTML = `
// //     <div class="section">
// //         <img id="nasaImage" src="" alt="Astronomy Picture of the Day">
// //         <p id="nasaDescription">Loading...</p>
// //         <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank">Do you want more?</a>
// //     </div>`
// // document.body.appendChild(section)



// document.getElementsByClassName("close")[0].addEventListener("click", () => {
//     let openContent = document.getElementById("openContent")

//     document.getElementsByClassName("modal")[0].style.display = "none"
// })


// setTimeout(function () {
//     document.getElementsByClassName("modal")[0].style.display = "block"
// }, 1000) //300000 = 5min




// document.addEventListener("DOMContentLoaded", function () {
//   const nasaApi = 'https://api.nasa.gov/planetary/apod?api_key=jMn2ZZOMdgqed1ysFhsOqalitwdNud8eCenBt3LC';

//   fetch(nasaApi)
//       .then(response => response.json())
//       .then(data => {
//           const nasaDescription = document.getElementById('nasaDescription');
//           const nasaImage = document.getElementById('nasaImage');

//           if (data.media_type === "image") {
//               nasaImage.src = data.url;

//               const fullText = data.explanation;
//               const shortText = fullText.length > 30 ? fullText.slice(0, 30) + "..." : fullText;

//               nasaDescription.textContent = shortText;

//               nasaDescription.addEventListener("click", () => {
//                   nasaDescription.textContent = (nasaDescription.textContent === shortText) ? fullText : shortText;
//               });

//               nasaDescription.style.cursor = "pointer";

//           } else {
//               nasaDescription.textContent = 'Today is not picture, but video 🎥. Click 👇';
//           }
//       })
//       .catch(err => {
//           console.error('Chyba při načítání obrázku z NASA API:', err);
//           document.getElementById('nasaDescription').textContent = 'Nepodařilo se načíst obrázek dne.';
//       });
// });
