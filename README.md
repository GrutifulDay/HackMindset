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
Every day, the extension brings insight from astronomy, history and digital culture — without tracking, ads or personal data collection.

The project also serves as a fullstack security sandbox: JWT handling, rate limiting, anomaly detection, IP reputation logic, NGINX-level filtering and multi-layered API protection.

**HackMindset is also my long-term learning ground for backend development and security.  
I built everything manually — JWT flow, IP reputation logic, rate limiting layers, NGINX protections and a future honeypoint — to understand how real attacks behave and how to defend against them.**

---

## 🌟 Features

### 🌌 NASA – Astronomy Picture of the Day  
<img src="readme-assets/nasa.png" width="280">

A daily view into space using NASA’s official APOD image and description.  
A calm science moment embedded directly in your browser.

### 🧭 Digitální rozcestník (Digital Signpost)  
<img src="readme-assets/signpost.png" width="280">

A **weekly Monday** educational card explaining modern digital topics:  
algorithms, privacy, AI behaviour, online identity, social media patterns and more.

### 📜 Story of the Day  
<img src="readme-assets/story.png" width="280">

A true historical event connected to today’s date, always beginning with:

- **CZ:** „Dnes, ale v roce…“  
- **EN:** „Today, back in the year…“

### 🕹 Retro Machine  
<img src="readme-assets/retro.png" width="280">

A nostalgic journey through technological evolution from the 70s to today.

### 📸 Moje Insta tipy (Inspiration Profiles)  
<img src="readme-assets/insta.png" width="280">

Curated Instagram recommendations in fields such as space, nature, science and technology.

---

## 🎞 Interaction Preview and Tooltips  
<div style="text-align: left;">
  <img src="readme-assets/false-report.png" width="280">
  <img src="readme-assets/nevedel.png" width="280">
  <img src="readme-assets/vedel.png" width="280">
  <img src="readme-assets/vedel-color.png" width="280">
  <img src="readme-assets/zazil-color.png" width="280">
</div>

---

## 🛡 Security Architecture (Backend & Network)

HackMindset is built with a layered defensive model.

### **API Protection**
- JWT authentication (5-minute expiry)  
- JTI-based token revocation  
- Abuse detection with Discord alerts  
- Origin + User-Agent validation  
- Restricted API exposure → valid API key + JWT required  
- All rejected requests are logged for analysis

### **Request Filtering & Middleware**
- Adaptive rate limiting (soft + hard)  
- Bot/User-Agent filtering  
- IP blacklist (auto-updated)  
- Custom CORS validation  
- Header filtering & sanitization  
- Private endpoint (`/_sec-log`) for future honeypoint and network-level logging

### **Network & Infrastructure (NGINX Layer)**
Production uses a hardened NGINX reverse proxy:

- **GeoIP filtering (only CZ + DE)**  
  *(If you test from outside these regions, requests will be blocked.)*
- **Invalid Host Protection (`return 444`)**  
- **Rate limiting:** `limit_req zone=reqlimit burst=40 nodelay`  
- **Connection limiting:** `limit_conn connlimit 20`  
- **Slow-attack defense:**  
  - `client_header_timeout 10s`  
  - `client_body_timeout 10s`  
  - `send_timeout 10s`  
  - `keepalive_timeout 15s`  
- Strong TLS + OCSP stapling  
- Security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Blocklists for scanners (`phpmyadmin`, `.env`, backups, wp-admin…)  
- Reverse proxy to Node.js on localhost  
- `server_tokens off` + empty `Server` header

Backend uses two MongoDB databases:
- **frontendData** — content  
- **securityDataIP** — blacklist, honeysessions, secret leaks, logs

---

## 🎨 Frontend (Chrome Extension)
- Component-like Vanilla JS  
- Popup / content script / background separation  
- Multi-language (CZ/EN)  
- Central fetch + caching layer across modules  
- Tooltip engine  
- Sound trigger module  
- JetBrains Mono typography  
- No tracking, no cookies, no external scripts

---

## 🛠 Backend (Node.js + Express)
- Controllers, routes, middlewares, utils  
- Two MongoDB connections  
- JWT auth with revocation  
- IP reputation logic  
- Structured anomaly logging  
- Discord notifications  
- Daily cron refresh (**00:01**)  
- `/_sec-log` protected route  
- Separation of content vs. security data

---

## 🏗 Server & Deployment
- Ubuntu 22.04 VPS  
- Hardened NGINX reverse proxy  
- GeoIP, rate limiting, slow-attack defense  
- UFW + Fail2Ban  
- Dedicated security headers  
- Custom CORS preflight  
- Backend on `127.0.0.1:3000`  
- Honeypoint-ready architecture  

---

## 🔧 Chrome Extension Setup (Developer Mode)

The extension UI loads normally, but all daily content (NASA, Story, Retro, Inspiration Profiles, Digital Signpost) is fetched from the backend API.  
**Without the backend running, the UI will load but all content sections will remain empty.**

To make the extension fully functional:

- Create a `.env` file based on `.env.example`
- Start the backend locally

Steps:
1. Create `.env` from `.env.example` (backend directory)
2. Start backend: `node server.js`
3. Open **chrome://extensions/**
4. Enable **Developer Mode**
5. Load the **frontend** folder
6. Launch the extension

---

## 🔧 Backend Setup  
```bash
git clone https://github.com/GrutifulDay/HackMindset.git
cd HackMindset/backend
npm install
cp .env.example .env   # fill in your values
node server.js
```
