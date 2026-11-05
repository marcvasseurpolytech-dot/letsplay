// Profils élèves + sauvegarde de progression (un fichier JSON par élève dans le dépôt de données).
const L = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) return res.status(500).json({ error: 'Cloud save is not configured yet (missing GITHUB_TOKEN).' });

  const b = req.body || {};
  const action = b.action;

  // ---------------------------------------------------------------- signup
  if (action === 'signup') {
    const nom = String(b.nom || '').trim().slice(0, 40);
    const code = String(b.code || '');
    const key = L.playerKey(nom);
    if (!key) return res.status(400).json({ error: 'Please enter your name (letters and digits).' });
    if (!/^\d{4}$/.test(code)) return res.status(400).json({ error: 'Your secret code must be exactly 4 digits.' });
    const profile = {
      nom: nom.toUpperCase(), codeHash: L.codeHash(key, code),
      createdAt: new Date().toISOString(), best: 0, progress: null, wb: null, wbBest: 0, xm: null, xmBest: 0
    };
    // Création sans sha : GitHub refuse (422) si le fichier existe déjà, ce qui garantit l'unicité.
    const r = await L.ghPut(L.pathOf(key), profile, null, ghToken, `new player ${key}`);
    if (r.ok) return res.json({ token: L.issueToken(key), user: { key, nom: profile.nom }, progress: null, best: 0, wb: null, wbBest: 0, xm: null, xmBest: 0 });
    if (r.status === 422) return res.status(409).json({ error: 'This name is already registered. Log in, or add your first name to be unique.' });
    return res.status(500).json({ error: 'Could not create the profile. Try again.' });
  }

  // ---------------------------------------------------------------- login
  if (action === 'login') {
    if (L.throttled(req)) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
    const nom = String(b.nom || '').trim().slice(0, 40);
    const code = String(b.code || '');
    const key = L.playerKey(nom);
    const bad = () => { L.noteFailure(req); return res.status(401).json({ error: 'Incorrect name or code.' }); };
    if (!key || !/^\d{4}$/.test(code)) return bad();
    const f = await L.ghGet(L.pathOf(key), ghToken);
    if (f.error) return res.status(500).json({ error: 'Could not reach the save storage. Try again.' });
    if (f.missing || !L.safeEqual(f.data.codeHash || '', L.codeHash(key, code))) return bad();
    L.clearFailures(req);
    const d = f.data;
    return res.json({ token: L.issueToken(key), user: { key, nom: d.nom }, progress: d.progress || null, best: d.best || 0, wb: d.wb || null, wbBest: d.wbBest || 0, xm: d.xm || null, xmBest: d.xmBest || 0 });
  }

  // ---------------------------------------------------------------- load / save (jeton requis)
  if (action === 'load' || action === 'save') {
    const key = L.keyFromRequest(req);
    if (!key) return res.status(401).json({ error: 'Session expired. Please log in again.' });
    if (action === 'load') {
      const f = await L.ghGet(L.pathOf(key), ghToken);
      if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
      return res.json({ progress: f.data.progress || null, best: f.data.best || 0, wb: f.data.wb || null, wbBest: f.data.wbBest || 0, xm: f.data.xm || null, xmBest: f.data.xmBest || 0 });
    }
    if (b.game === 'xm') {
      const xm = L.cleanXmProgress(b.progress);
      if (!xm) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data;
        d.xm = xm;
        d.xmBest = Math.max(d.xmBest || 0, xm.best);
        d.xmUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save xm ${key}`);
        if (r.ok) return res.json({ success: true, best: d.xmBest });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'wb') {
      const wb = L.cleanWbProgress(b.progress);
      if (!wb) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data;
        d.wb = wb;
        d.wbBest = Math.max(d.wbBest || 0, wb.best);
        d.wbUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save wb ${key}`);
        if (r.ok) return res.json({ success: true, best: d.wbBest });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    const progress = L.cleanProgress(b.progress);
    if (!progress) return res.status(400).json({ error: 'Invalid progress data.' });
    for (let attempt = 0; attempt < 3; attempt++) {
      const f = await L.ghGet(L.pathOf(key), ghToken);
      if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
      const d = f.data;
      d.progress = progress;
      d.best = Math.max(d.best || 0, progress.best);
      d.updatedAt = new Date().toISOString();
      const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save ${key}`);
      if (r.ok) return res.json({ success: true, best: d.best });
    }
    return res.status(500).json({ error: 'Save conflict. Try again.' });
  }

  return res.status(400).json({ error: 'Unknown action.' });
};
