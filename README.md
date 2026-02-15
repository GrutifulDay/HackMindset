# HackMindset – Chrome Extension  
A privacy-friendly daily knowledge companion that turns mindless scrolling into meaningful moments.

<div style="text-align: left;">
  <img src="readme-assets/preview.png" width="280">
  <img src="readme-assets/about-extension.png" width="285">
</div>

**Live Extension:** *(coming soon)*  
**Repository:** https://github.com/GrutifulDay/HackMindset  

---

## 💡 Overview  

HackMindset delivers small, meaningful pieces of knowledge that replace algorithm-driven noise with calm, inspiring content.  
Each day, the extension brings insight from astronomy, history and digital culture — without tracking, ads or personal data collection.

The project also serves as a fullstack architecture and security study.  
The backend is deployed on a public VPS behind a hardened NGINX reverse proxy.  
Real-world traffic (including bot and scanner attempts) is logged and used to iteratively improve defensive mechanisms.

All backend security layers were implemented manually to understand how authentication, filtering and infrastructure protection work in practice.

---

## 🌟 Features

### 🌌 NASA – Astronomy Picture of the Day  
<img src="readme-assets/nasa.png" width="280">

A daily view into space using NASA’s official APOD image and description.  
A calm science moment embedded directly in your browser.

---

### 🧭 Digitální rozcestník (Digital Signpost)  
<img src="readme-assets/signpost.png" width="280">

A weekly educational card explaining modern digital topics such as algorithms, privacy, AI behaviour, online identity and social media patterns.

---

### 📜 Story of the Day  
<img src="readme-assets/story.png" width="280">

A true historical event connected to today’s date, always beginning with:

- **CZ:** „Dnes, ale v roce…“  
- **EN:** „Today, back in the year…“

---

### 🕹 Retro Machine  
<img src="readme-assets/retro.png" width="280">

A nostalgic journey through technological evolution from the 70s to today.

---

### 📸 Moje Insta tipy (Inspiration Profiles)  
<img src="readme-assets/insta.png" width="280">

Curated Instagram recommendations in space, nature, science and technology.

---

## 🎞 Interaction Preview and Tooltips  
<div style="text-align: left;">
  <img src="readme-assets/nevedel.png" width="280">
  <img src="readme-assets/vedel.png" width="276">
  <img src="readme-assets/vedel-color.png" width="280">
</div>

---

## 🛡 Architecture & Security Model

HackMindset follows a layered defensive approach.

### Backend (Node.js + Express)

- REST API with layered architecture (routes → controllers → services)  
- JWT authentication (short-lived tokens + JTI revocation)  
- Adaptive rate limiting  
- Origin and User-Agent validation  
- Structured anomaly logging  
- IP blacklist with automated updates  
- Discord notifications for suspicious activity  

Two separate data domains are maintained:
- **Content data** (daily entries)  
- **Security data** (IP reputation, logs, anomaly tracking)

---

### Network & Infrastructure

The backend runs on Ubuntu 22.04 VPS behind an NGINX reverse proxy.

Key protections include:

- HTTPS with TLS configuration  
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)  
- Region-based request filtering (GeoIP)  
- Request and connection rate limiting  
- Slow-client protection  
- Scanner and invalid-host blocking  
- UFW firewall + Fail2Ban  
- Backend exposed only on `127.0.0.1:3000` behind reverse proxy  

The infrastructure is continuously monitored and adjusted based on real traffic behaviour.

---

## 🎨 Frontend (Chrome Extension)

- Component-style Vanilla JavaScript  
- Popup / background / content script separation  
- Multi-language (CZ / EN)  
- Centralized fetch & caching layer  
- Tooltip engine  
- Optional sound triggers for retro section  
- No tracking, no cookies, no external analytics  

---

## 🔍 Evaluation Notes

This repository is intended as an architectural and technical reference.

The Chrome extension consumes all daily content from a secured backend API.  
If the backend is unavailable, the extension loads in a UI-only state.

Production configuration, environment variables and live infrastructure details are intentionally excluded.
