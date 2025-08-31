// backend/middlewares/stripUntruthVotes.js
function scrub(obj) {
    if (!obj || typeof obj !== "object") return;
    if ("untruthVotes" in obj) delete obj.untruthVotes;
  }
  
  export default function stripUntruthVotes(_req, res, next) {
    const origJson = res.json.bind(res);
    const origSend = res.send.bind(res);
  
    // zachyti v json
    res.json = (body) => {
      try {
        if (Array.isArray(body)) body.forEach(scrub);
        else scrub(body);
      } catch (_) {}
      return origJson(body);
    };
  
    // zachyti i .send() (string nebo object)
    res.send = (body) => {
      try {
        if (typeof body === "string") {
          try {
            const parsed = JSON.parse(body);
            if (Array.isArray(parsed)) parsed.forEach(scrub);
            else scrub(parsed);
            res.set("Content-Type", "application/json; charset=utf-8");
            return origSend(JSON.stringify(parsed));
          } catch { /* neni to json string → posle dal bezezmeny */ }
        } else if (body && typeof body === "object") {
          if (Array.isArray(body)) body.forEach(scrub);
          else scrub(body);
        }
      } catch (_) {}
      return origSend(body);
    };
  
    next();
  }
  