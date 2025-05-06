const panel = document.createElement("div");
panel.id = "my-popup-panel";
panel.textContent = "Ahoj z rozšíření 👋 sdchgsdfcbskdjcbsdcjs kdjc";


Object.assign(panel.style, {
  position: "fixed",
  top: "10px",
  right: "50px",
  width: "250px",
  backgroundColor: "#ffffff",
  color: "#333",
  padding: "16px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  fontFamily: "Arial, sans-serif",
  zIndex: "999999"
});

document.body.appendChild(panel)
