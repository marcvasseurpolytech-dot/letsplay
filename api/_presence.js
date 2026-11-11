// Présence en ligne + historique des connexions.
// Mode exact : Redis (Upstash / Vercel KV) si KV_REST_API_URL + KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_*) existent.
// Sinon : mémoire de l'instance serveur (estimation, perdue à chaque redémarrage de la fonction).
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOK_ = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const redis = !!(URL_ && TOK_);
const SESSION_GAP = 10 * 60 * 1000;   // plus de 10 min sans signal = nouvelle session
const KEEP = 900;                     // secondes de conservation d'une présence
const HIST_MAX = 3000;

const mem = global.__lpPresence || (global.__lpPresence = { on: new Map(), hist: [] });

async function run(cmds) {
  const r = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { Authorization: 'Bearer ' + TOK_, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).map(x => x.result);
}

const deviceOf = req => {
  const ua = String(req.headers['user-agent'] || '');
  return /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';
};

async function pushHistory(ev) {
  if (redis) { try { await run([['RPUSH', 'lp:hist', JSON.stringify(ev)], ['LTRIM', 'lp:hist', -HIST_MAX, -1]]); } catch (e) {} return; }
  mem.hist.push(ev); if (mem.hist.length > HIST_MAX) mem.hist.splice(0, mem.hist.length - HIST_MAX);
}

// signal de présence d'un élève (appelé toutes les ~60 s par chaque page ouverte)
async function touch(key, nom, game, device) {
  const now = Date.now();
  if (redis) {
    try {
      const prevRaw = (await run([['GET', 'lp:p:' + key]]))[0];
      let prev = null; try { prev = prevRaw ? JSON.parse(prevRaw) : null; } catch (e) {}
      const fresh = !prev || now - prev.t > SESSION_GAP;
      const cur = { nom, g: game, t: now, s: fresh ? now : prev.s, d: device };
      const cmds = [['SET', 'lp:p:' + key, JSON.stringify(cur), 'EX', KEEP], ['ZADD', 'lp:on', now, key], ['ZREMRANGEBYSCORE', 'lp:on', 0, now - KEEP * 1000]];
      if (fresh) { cmds.push(['RPUSH', 'lp:hist', JSON.stringify({ t: now, k: key, n: nom, g: game, d: device, e: 'session' })]); cmds.push(['LTRIM', 'lp:hist', -HIST_MAX, -1]); }
      await run(cmds);
    } catch (e) {}
    return;
  }
  const prev = mem.on.get(key), fresh = !prev || now - prev.t > SESSION_GAP;
  mem.on.set(key, { nom, g: game, t: now, s: fresh ? now : prev.s, d: device });
  if (fresh) await pushHistory({ t: now, k: key, n: nom, g: game, d: device, e: 'session' });
  if (mem.on.size > 2000) for (const [k, v] of mem.on) if (now - v.t > KEEP * 1000) mem.on.delete(k);
}

async function online(windowMs) {
  const now = Date.now(), min = now - windowMs;
  if (redis) {
    try {
      const keys = (await run([['ZRANGEBYSCORE', 'lp:on', min, '+inf']]))[0] || [];
      if (!keys.length) return [];
      const vals = await run(keys.map(k => ['GET', 'lp:p:' + k]));
      return keys.map((k, i) => { let v = null; try { v = vals[i] ? JSON.parse(vals[i]) : null; } catch (e) {} return v && v.t >= min ? { key: k, nom: v.nom, game: v.g, since: v.s, lastSeen: v.t, device: v.d } : null; }).filter(Boolean);
    } catch (e) { return []; }
  }
  const out = [];
  mem.on.forEach((v, k) => { if (v.t >= min) out.push({ key: k, nom: v.nom, game: v.g, since: v.s, lastSeen: v.t, device: v.d }); });
  return out;
}

async function history(n) {
  if (redis) {
    try { return ((await run([['LRANGE', 'lp:hist', -n, -1]]))[0] || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean); } catch (e) { return []; }
  }
  return mem.hist.slice(-n);
}

module.exports = { redis, deviceOf, pushHistory, touch, online, history };
