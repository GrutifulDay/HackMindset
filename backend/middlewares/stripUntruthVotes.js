export default function stripUntruthVotes(_req, res, next) {
    const origJson = res.json.bind(res);
  
    res.json = (body) => {
      try {
        // Odeber z objektu
        const scrub = (obj) => {
          if (obj && typeof obj === "object") {
            if ("untruthVotes" in obj) delete obj.untruthVotes;
          }
        };
  
        if (Array.isArray(body)) {
          body.forEach(scrub);
        } else {
          scrub(body);
        }
      } catch (_) {
        // nic – nechceme rozbít odpověď kvůli chybě při mazání
      }
      return origJson(body);
    };
  
    next();
  }
  