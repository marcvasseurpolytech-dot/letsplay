// Profils élèves + sauvegarde de progression (un fichier JSON par élève dans le dépôt de données).
const L = require('./_lib');
const P = require('./_presence');

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
      createdAt: new Date().toISOString(), best: 0, progress: null, wb: null, wbBest: 0, xm: null, xmBest: 0, sc: null, scBest: 0, tn: null, tnBest: 0, td: null, tdBest: 0, ti: null, tiBest: 0, tg: null, tgBest: 0, tr: null, trBest: 0
    };
    // Création sans sha : GitHub refuse (422) si le fichier existe déjà, ce qui garantit l'unicité.
    const r = await L.ghPut(L.pathOf(key), profile, null, ghToken, `new player ${key}`);
    if (r.ok) await P.pushHistory({ t: Date.now(), k: key, n: profile.nom, g: 'hub', d: P.deviceOf(req), e: 'signup' });
    if (r.ok) return res.json({ token: L.issueToken(key), user: { key, nom: profile.nom }, progress: null, best: 0, wb: null, wbBest: 0, xm: null, xmBest: 0, sc: null, scBest: 0, tn: null, tnBest: 0, td: null, tdBest: 0, ti: null, tiBest: 0, tg: null, tgBest: 0, tr: null, trBest: 0 });
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
    const ev = { t: Date.now(), k: key, n: d.nom, g: 'hub', d: P.deviceOf(req), e: 'login' };
    if (P.redis) await P.pushHistory(ev);
    else {
      // sans Redis : l'historique est gardé dans le profil de l'élève (un seul essai, sans bloquer la connexion)
      d.logins = (d.logins || []).concat([{ t: ev.t, d: ev.d }]).slice(-60);
      d.lastLogin = new Date(ev.t).toISOString(); d.loginCount = (d.loginCount || 0) + 1;
      try { await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `login ${key}`); } catch (e) {}
    }
    return res.json({ token: L.issueToken(key), user: { key, nom: d.nom }, progress: d.progress || null, best: d.best || 0, wb: d.wb || null, wbBest: d.wbBest || 0, xm: d.xm || null, xmBest: d.xmBest || 0, sc: d.sc || null, scBest: d.scBest || 0, tn: d.tn || null, tnBest: d.tnBest || 0, td: d.td || null, tdBest: d.tdBest || 0, ti: d.ti || null, tiBest: d.tiBest || 0, tg: d.tg || null, tgBest: d.tgBest || 0, tr: d.tr || null, trBest: d.trBest || 0 });
  }

  // ---------------------------------------------------------------- présence (jeton requis, aucune lecture GitHub)
  if (action === 'ping') {
    const key = L.keyFromRequest(req);
    if (!key) return res.status(401).json({ error: 'Session expired.' });
    const game = /^[a-z]{2,6}$/.test(String(b.game || '')) ? b.game : 'hub';
    const nom = String(b.nom || key).replace(/[<>]/g, '').slice(0, 40);
    await P.touch(key, nom, game, P.deviceOf(req));
    return res.json({ ok: true });
  }

  // ---------------------------------------------------------------- load / save (jeton requis)
  if (action === 'load' || action === 'save') {
    const key = L.keyFromRequest(req);
    if (!key) return res.status(401).json({ error: 'Session expired. Please log in again.' });
    if (action === 'load') {
      const f = await L.ghGet(L.pathOf(key), ghToken);
      if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
      return res.json({ progress: f.data.progress || null, best: f.data.best || 0, wb: f.data.wb || null, wbBest: f.data.wbBest || 0, xm: f.data.xm || null, xmBest: f.data.xmBest || 0, sc: f.data.sc || null, scBest: f.data.scBest || 0, tn: f.data.tn || null, tnBest: f.data.tnBest || 0, td: f.data.td || null, tdBest: f.data.tdBest || 0, ti: f.data.ti || null, tiBest: f.data.tiBest || 0, tg: f.data.tg || null, tgBest: f.data.tgBest || 0, tr: f.data.tr || null, trBest: f.data.trBest || 0 });
    }
    if (b.game === 'tn') {
      const tn = L.cleanTnProgress(b.progress);
      if (!tn) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.tn || {};
        // fusion : on ne perd jamais un verbe déjà cassé ni un record ; le point de reprise le plus récent l'emporte
        const words = Object.assign({}, old.words || {});
        Object.keys(tn.words).forEach(k => { words[k] = Math.max(words[k] || 0, tn.words[k]); });
        const newer = tn.savedAt >= (old.savedAt || 0);
        d.tn = {
          words, best: Math.max(old.best || 0, tn.best), runs: Math.max(old.runs || 0, tn.runs),
          maxRound: Math.max(old.maxRound || 1, tn.maxRound), destroyed: Math.max(old.destroyed || 0, tn.destroyed),
          qOk: Math.max(old.qOk || 0, tn.qOk), qN: Math.max(old.qN || 0, tn.qN),
          cp: newer ? tn.cp : (old.cp || null), savedAt: Math.max(old.savedAt || 0, tn.savedAt)
        };
        d.tnBest = Math.max(d.tnBest || 0, tn.best);
        d.tnUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save tn ${key}`);
        if (r.ok) return res.json({ success: true, best: d.tnBest, tn: d.tn });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'td') {
      const td = L.cleanTnProgress(b.progress);
      if (!td) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.td || {};
        // fusion : on ne perd jamais un verbe déjà cassé ni un record ; le point de reprise le plus récent l'emporte
        const words = Object.assign({}, old.words || {});
        Object.keys(td.words).forEach(k => { words[k] = Math.max(words[k] || 0, td.words[k]); });
        const newer = td.savedAt >= (old.savedAt || 0);
        d.td = {
          words, best: Math.max(old.best || 0, td.best), runs: Math.max(old.runs || 0, td.runs),
          maxRound: Math.max(old.maxRound || 1, td.maxRound), destroyed: Math.max(old.destroyed || 0, td.destroyed),
          qOk: Math.max(old.qOk || 0, td.qOk), qN: Math.max(old.qN || 0, td.qN),
          cp: newer ? td.cp : (old.cp || null), savedAt: Math.max(old.savedAt || 0, td.savedAt)
        };
        d.tdBest = Math.max(d.tdBest || 0, td.best);
        d.tdUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save td ${key}`);
        if (r.ok) return res.json({ success: true, best: d.tdBest, td: d.td });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'ti') {
      const ti = L.cleanTnProgress(b.progress);
      if (!ti) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.ti || {};
        // fusion : on ne perd jamais un verbe déjà cassé ni un record ; le point de reprise le plus récent l'emporte
        const words = Object.assign({}, old.words || {});
        Object.keys(ti.words).forEach(k => { words[k] = Math.max(words[k] || 0, ti.words[k]); });
        const newer = ti.savedAt >= (old.savedAt || 0);
        d.ti = {
          words, best: Math.max(old.best || 0, ti.best), runs: Math.max(old.runs || 0, ti.runs),
          maxRound: Math.max(old.maxRound || 1, ti.maxRound), destroyed: Math.max(old.destroyed || 0, ti.destroyed),
          qOk: Math.max(old.qOk || 0, ti.qOk), qN: Math.max(old.qN || 0, ti.qN),
          cp: newer ? ti.cp : (old.cp || null), savedAt: Math.max(old.savedAt || 0, ti.savedAt)
        };
        d.tiBest = Math.max(d.tiBest || 0, ti.best);
        d.tiUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save ti ${key}`);
        if (r.ok) return res.json({ success: true, best: d.tiBest, ti: d.ti });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'tg') {
      const tg = L.cleanTnProgress(b.progress);
      if (!tg) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.tg || {};
        // fusion : on ne perd jamais un verbe déjà cassé ni un record ; le point de reprise le plus récent l'emporte
        const words = Object.assign({}, old.words || {});
        Object.keys(tg.words).forEach(k => { words[k] = Math.max(words[k] || 0, tg.words[k]); });
        const newer = tg.savedAt >= (old.savedAt || 0);
        d.tg = {
          words, best: Math.max(old.best || 0, tg.best), runs: Math.max(old.runs || 0, tg.runs),
          maxRound: Math.max(old.maxRound || 1, tg.maxRound), destroyed: Math.max(old.destroyed || 0, tg.destroyed),
          qOk: Math.max(old.qOk || 0, tg.qOk), qN: Math.max(old.qN || 0, tg.qN),
          cp: newer ? tg.cp : (old.cp || null), savedAt: Math.max(old.savedAt || 0, tg.savedAt)
        };
        d.tgBest = Math.max(d.tgBest || 0, tg.best);
        d.tgUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save tg ${key}`);
        if (r.ok) return res.json({ success: true, best: d.tgBest, tg: d.tg });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'tr') {
      const tr = L.cleanTnProgress(b.progress);
      if (!tr) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.tr || {};
        // fusion : on ne perd jamais un verbe déjà cassé ni un record ; le point de reprise le plus récent l'emporte
        const words = Object.assign({}, old.words || {});
        Object.keys(tr.words).forEach(k => { words[k] = Math.max(words[k] || 0, tr.words[k]); });
        const newer = tr.savedAt >= (old.savedAt || 0);
        d.tr = {
          words, best: Math.max(old.best || 0, tr.best), runs: Math.max(old.runs || 0, tr.runs),
          maxRound: Math.max(old.maxRound || 1, tr.maxRound), destroyed: Math.max(old.destroyed || 0, tr.destroyed),
          qOk: Math.max(old.qOk || 0, tr.qOk), qN: Math.max(old.qN || 0, tr.qN),
          cp: newer ? tr.cp : (old.cp || null), savedAt: Math.max(old.savedAt || 0, tr.savedAt)
        };
        d.trBest = Math.max(d.trBest || 0, tr.best);
        d.trUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save tr ${key}`);
        if (r.ok) return res.json({ success: true, best: d.trBest, tr: d.tr });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'cg') {
      const cg = L.cleanCgProgress(b.progress);
      if (!cg) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = (d.cg && d.cg.grids) || [];
        // fusion : on garde le meilleur score de chaque grille
        const grids = cg.grids.map((g, i) => { const o = old[i]; return !g ? (o || null) : (!o || g.s > o.s ? g : o); });
        d.cg = { grids, savedAt: cg.savedAt };
        d.cgBest = grids.reduce((m, g) => Math.max(m, g ? g.s : 0), 0);
        d.cgUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save cg ${key}`);
        if (r.ok) return res.json({ success: true, best: d.cgBest });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
    }
    if (b.game === 'sc') {
      const sc = L.cleanScProgress(b.progress);
      if (!sc) return res.status(400).json({ error: 'Invalid progress data.' });
      for (let attempt = 0; attempt < 3; attempt++) {
        const f = await L.ghGet(L.pathOf(key), ghToken);
        if (f.error || f.missing) return res.status(500).json({ error: 'Profile not found.' });
        const d = f.data, old = d.sc || {};
        // fusion : on ne perd jamais un connecteur déjà collecté (autre appareil, partie précédente)
        const words = Object.assign({}, old.words || {});
        Object.keys(sc.words).forEach(k => { words[k] = Math.max(words[k] || 0, sc.words[k]); });
        d.sc = {
          words, best: Math.max(old.best || 0, sc.best), runs: Math.max(old.runs || 0, sc.runs),
          maxLoop: Math.max(old.maxLoop || 1, sc.maxLoop), destroyed: Math.max(old.destroyed || 0, sc.destroyed), savedAt: sc.savedAt
        };
        d.scBest = Math.max(d.scBest || 0, sc.best);
        d.scUpdatedAt = new Date().toISOString();
        const r = await L.ghPut(L.pathOf(key), d, f.sha, ghToken, `save sc ${key}`);
        if (r.ok) return res.json({ success: true, best: d.scBest, sc: d.sc });
      }
      return res.status(500).json({ error: 'Save conflict. Try again.' });
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
