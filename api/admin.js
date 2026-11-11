// Espace enseignant : liste des profils et de leur progression, code oublié, suppression.
const L = require('./_lib');
const P = require('./_presence');

async function mapLimit(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) return res.status(500).json({ error: 'Missing GITHUB_TOKEN.' });
  const b = req.body || {};

  if (b.action === 'login') {
    if (L.throttled(req)) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
    if (!L.checkAdminPassword(String(b.password || ''))) { L.noteFailure(req); return res.status(401).json({ error: 'Incorrect password.' }); }
    L.clearFailures(req);
    return res.json({ token: L.issueAdminToken() });
  }

  if (!L.isAdmin(req)) return res.status(401).json({ error: 'Admin session expired. Please log in again.' });

  if (b.action === 'list') {
    const dir = await L.ghList(L.DIR, ghToken);
    if (dir.error) return res.status(500).json({ error: 'Could not read the data repository.' });
    const rows = await mapLimit(dir.items, 8, async it => {
      const f = await L.ghGet(it.path, ghToken);
      if (!f.data) return null;
      const d = f.data, p = d.progress || {}, st = p.stats || {};
      return {
        key: it.name.replace(/\.json$/, ''), nom: d.nom, createdAt: d.createdAt || null, updatedAt: d.updatedAt || null,
        level: p.level || 1, score: p.score || 0, best: d.best || 0,
        answered: st.answered || 0, correct: st.correct || 0, levelsCleared: st.levelsCleared || 0,
        maxLevel: st.maxLevel || 1, byCat: st.byCat || {},
        wb: d.wb ? {
          level: d.wb.level || 1, score: d.wb.score || 0, best: d.wbBest || 0, updatedAt: d.wbUpdatedAt || null,
          answered: (d.wb.stats || {}).answered || 0, correct: (d.wb.stats || {}).correct || 0,
          levelsCleared: (d.wb.stats || {}).levelsCleared || 0, maxLevel: (d.wb.stats || {}).maxLevel || 1,
          gifts: (d.wb.stats || {}).gifts || 0, giftsOk: (d.wb.stats || {}).giftsOk || 0,
          byCat: (d.wb.stats || {}).byCat || {}
        } : null,
        xm: d.xm ? {
          day: d.xm.day || 1, score: d.xm.score || 0, best: d.xmBest || 0, updatedAt: d.xmUpdatedAt || null,
          answered: (d.xm.stats || {}).answered || 0, correct: (d.xm.stats || {}).correct || 0,
          levelsCleared: (d.xm.stats || {}).levelsCleared || 0, maxLevel: (d.xm.stats || {}).maxLevel || 1,
          gifts: (d.xm.stats || {}).gifts || 0, giftsOk: (d.xm.stats || {}).giftsOk || 0,
          items: (d.xm.own || []).length, coins: d.xm.coins || 0, advent: (d.xm.adv || []).length,
          byCat: (d.xm.stats || {}).byCat || {}
        } : null,
        sc: d.sc ? {
          best: d.scBest || 0, updatedAt: d.scUpdatedAt || null, runs: d.sc.runs || 0, maxLoop: d.sc.maxLoop || 1,
          destroyed: d.sc.destroyed || 0, words: d.sc.words || {}
        } : null
      };
    });
    return res.json({ players: rows.filter(Boolean) });
  }

  // ---- joueurs en ligne + historique des connexions (léger : aucune lecture GitHub)
  if (b.action === 'online') {
    const win = 150 * 1000;
    const [on, recent, hist] = await Promise.all([P.online(win), P.online(15 * 60 * 1000), P.history(500)]);
    return res.json({ mode: P.redis ? 'redis' : 'memory', now: Date.now(), online: on, recentCount: recent.length, history: hist });
  }

  // ---- vue d'ensemble : tous les élèves, tous les jeux
  if (b.action === 'overview') {
    const dir = await L.ghList(L.DIR, ghToken);
    if (dir.error) return res.status(500).json({ error: 'Could not read the data repository.' });
    const ts = s => (s ? Date.parse(s) || 0 : 0);
    const rows = await mapLimit(dir.items, 8, async it => {
      const f = await L.ghGet(it.path, ghToken);
      if (!f.data) return null;
      const d = f.data, p = d.progress || {}, st = p.stats || {}, g = {};
      if (d.progress) g.ae = { best: d.best || 0, level: p.level || 1, answered: st.answered || 0, correct: st.correct || 0, cleared: st.levelsCleared || 0, at: ts(d.updatedAt) };
      if (d.wb) { const s = d.wb.stats || {}; g.wb = { best: d.wbBest || 0, level: d.wb.level || 1, answered: s.answered || 0, correct: s.correct || 0, cleared: s.levelsCleared || 0, at: ts(d.wbUpdatedAt) }; }
      if (d.xm) { const s = d.xm.stats || {}; g.xm = { best: d.xmBest || 0, level: d.xm.day || 1, answered: s.answered || 0, correct: s.correct || 0, cleared: s.levelsCleared || 0, at: ts(d.xmUpdatedAt) }; }
      if (d.sc) g.sc = { best: d.scBest || 0, runs: d.sc.runs || 0, level: d.sc.maxLoop || 1, destroyed: d.sc.destroyed || 0, words: Object.keys(d.sc.words || {}).length, at: ts(d.scUpdatedAt) };
      [['tn', 'tnUpdatedAt', 'tnBest'], ['td', 'tdUpdatedAt', 'tdBest'], ['ti', 'tiUpdatedAt', 'tiBest'], ['tg', 'tgUpdatedAt', 'tgBest'], ['tr', 'trUpdatedAt', 'trBest']].forEach(([k, u, bk]) => {
        const x = d[k]; if (!x) return;
        g[k] = { best: d[bk] || 0, runs: x.runs || 0, level: x.maxRound || 1, destroyed: x.destroyed || 0, words: Object.keys(x.words || {}).length, answered: x.qN || 0, correct: x.qOk || 0, at: ts(d[u]) };
      });
      if (d.cg) { const gr = d.cg.grids || []; g.cg = { best: d.cgBest || 0, done: gr.filter(Boolean).length, grids: gr, at: ts(d.cgUpdatedAt) }; }
      const logins = (d.logins || []).map(x => ({ t: x.t, d: x.d }));
      const act = Math.max(0, ...Object.values(g).map(x => x.at || 0));
      return { key: it.name.replace(/\.json$/, ''), nom: d.nom, createdAt: ts(d.createdAt), games: g, activity: act, loginCount: d.loginCount || 0, lastLogin: ts(d.lastLogin), logins };
    });
    return res.json({ players: rows.filter(Boolean), now: Date.now() });
  }

  const key = String(b.key || '');
  if (!/^[A-Z0-9-]{1,40}$/.test(key)) return res.status(400).json({ error: 'Invalid player.' });
  const path = L.pathOf(key);

  if (b.action === 'resetCode') {
    const code = String(b.code || '');
    if (!/^\d{4}$/.test(code)) return res.status(400).json({ error: 'The new code must be exactly 4 digits.' });
    for (let a = 0; a < 3; a++) {
      const f = await L.ghGet(path, ghToken);
      if (!f.data) return res.status(404).json({ error: 'Player not found.' });
      f.data.codeHash = L.codeHash(key, code);
      const r = await L.ghPut(path, f.data, f.sha, ghToken, `reset code ${key}`);
      if (r.ok) return res.json({ success: true });
    }
    return res.status(500).json({ error: 'Save conflict. Try again.' });
  }

  if (b.action === 'delete') {
    const f = await L.ghGet(path, ghToken);
    if (!f.data) return res.status(404).json({ error: 'Player not found.' });
    const r = await L.ghDelete(path, f.sha, ghToken, `delete ${key}`);
    return r.ok ? res.json({ success: true }) : res.status(500).json({ error: 'Could not delete.' });
  }

  return res.status(400).json({ error: 'Unknown action.' });
};
