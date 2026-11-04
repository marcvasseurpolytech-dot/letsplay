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
    const nom = String(b.nom || '').trim().slice(0, 40).toUpperCase();
    const prenom = String(b.prenom || '').trim().slice(0, 40);
    const dept = String(b.dept || '').trim();
    const code = String(b.code || '');
    if (!nom || !prenom) return res.status(400).json({ error: 'Please enter your last name and first name.' });
    if (!L.CLASSES.includes(dept)) return res.status(400).json({ error: 'Please choose your class from the list.' });
    if (!/^\d{4}$/.test(code)) return res.status(400).json({ error: 'Your secret code must be exactly 4 digits.' });
    const key = L.playerKey(nom, prenom);
    if (!key) return res.status(400).json({ error: 'Please use letters in your name.' });
    const profile = {
      nom, prenom, dept, codeHash: L.codeHash(key, code),
      createdAt: new Date().toISOString(), best: 0, progress: null
    };
    // Création sans sha : GitHub refuse (422) si le fichier existe déjà, ce qui garantit l'unicité.
    const r = await L.ghPut(L.pathOf(key), profile, null, ghToken, `new player ${key}`);
    if (r.ok) return res.json({ token: L.issueToken(key), user: { key, nom, prenom, dept }, progress: null, best: 0 });
    if (r.status === 422) return res.status(409).json({ error: 'This name is already registered. Please log in instead.' });
    return res.status(500).json({ error: 'Could not create the profile. Try again.' });
  }

  // ---------------------------------------------------------------- login
  if (action === 'login') {
    if (L.throttled(req)) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
    const nom = String(b.nom || '').trim().slice(0, 40);
    const prenom = String(b.prenom || '').trim().slice(0, 40);
    const code = String(b.code || '');
    const key = L.playerKey(nom, prenom);
    const bad = () => { L.noteFailure(req); return res.status(401).json({ error: 'Incorrect name or code.' }); };
    if (!key || !/^\d{4}$/.test(code)) return bad();
    const f = await L.ghGet(L.pathOf(key), ghToken);
    if (f.error) return res.status(500).json({ error: 'Could not reach the save storage. Try again.' });
    if (f.missing || !L.safeEqual(f.data.codeHash || '', L.codeHash(key, code))) return bad();
    L.clearFailures(req);
    const d = f.data;
    return res.json({ token: L.issueToken(key), user: { key, nom: d.nom, prenom: d.prenom, dept: d.dept }, progress: d.progress || null, best: d.best || 0 });
  }

  // ---------------------------------------------------------------- load / save (jeton requis)
  if (action === 'load' || action === 'save') {
    const key = L.keyFromRequest(req);
    if (!key) return res.status(401).json({ error: 'Session expired. Please log in again.' });
    if (action === 'load') {
      const f = await L.ghGet(L.pathOf(key), ghToken);
      if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
      return res.json({ progress: f.data.progress || null, best: f.data.best || 0 });
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
