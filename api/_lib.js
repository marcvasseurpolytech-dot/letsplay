// Helpers partagés : stockage JSON dans un dépôt GitHub de données, jetons de session, limitation des essais.
// Le préfixe _ empêche Vercel d'exposer ce fichier comme endpoint.
const crypto = require('crypto');

// Dépôt de données (privé) : le même que toeic-entrainement par défaut, surchargeable via DATA_REPO.
// Écrire dans un autre dépôt que celui du site évite qu'une sauvegarde déclenche un redéploiement.
const REPO = process.env.DATA_REPO || 'marcvasseurpolytech-dot/toeic-entrainement-data';
const API = 'https://api.github.com';
const DIR = 'letsplay/players';

const TOKEN_DAYS = 30;

const sha256hex = s => crypto.createHash('sha256').update(String(s)).digest('hex');
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function secret() {
  return process.env.LETSPLAY_SECRET || sha256hex('letsplay:' + (process.env.GITHUB_TOKEN || ''));
}
const hmac = s => crypto.createHmac('sha256', secret()).update(s).digest('hex');

function slug(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}
// L'identifiant d'un élève est son nom (accents, majuscules et ponctuation ignorés).
function playerKey(nom) { return slug(nom); }
const pathOf = key => `${DIR}/${key}.json`;
const codeHash = (key, code) => hmac('code:' + key + ':' + code);

// ---- GitHub Contents API
const headers = token => ({ Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' });
async function ghGet(path, token) {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, { headers: headers(token) });
  if (r.status === 404) return { missing: true };
  if (!r.ok) return { error: r.status };
  const d = await r.json();
  return { data: JSON.parse(Buffer.from(d.content, 'base64').toString('utf8')), sha: d.sha };
}
async function ghPut(path, content, sha, token, message) {
  const body = { message: message || `update ${path}`, content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64') };
  if (sha) body.sha = sha;
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT', headers: { ...headers(token), 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return { ok: r.ok, status: r.status };
}

// ---- jetons de session signés (le code à 4 chiffres n'est jamais conservé côté navigateur)
function issueToken(key) {
  const exp = Date.now() + TOKEN_DAYS * 86400000;
  return `${key}.${exp}.${hmac('tok:' + key + ':' + exp)}`;
}
function keyFromRequest(req) {
  const h = req.headers['authorization'] || '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  const parts = tok.split('.');
  if (parts.length !== 3) return null;
  const [key, exp, sig] = parts;
  if (!/^[A-Z0-9-]{1,40}$/.test(key) || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return null;
  return safeEqual(sig, hmac('tok:' + key + ':' + exp)) ? key : null;
}

// ---- limitation des essais de connexion (au mieux, par instance et par IP)
const fails = new Map();
const ip = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?').split(',')[0].trim();
function throttled(req) { const f = fails.get(ip(req)); return !!f && f.n >= 8 && Date.now() - f.t < 10 * 60 * 1000; }
function noteFailure(req) {
  const k = ip(req), f = fails.get(k);
  if (!f || Date.now() - f.t > 10 * 60 * 1000) fails.set(k, { n: 1, t: Date.now() }); else { f.n++; f.t = Date.now(); }
}
function clearFailures(req) { fails.delete(ip(req)); }

// ---- validation de la progression envoyée par le navigateur
const CATS = ['c','v','w','f','p','l','s','x','t'];
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
const int = (v, lo, hi, d) => { v = Math.floor(Number(v)); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
function cleanBoard(b) {
  if (!b || typeof b !== 'object') return null;
  const W = int(b.W, 5, 30, 0), H = int(b.H, 5, 30, 0);
  if (!W || !H || !Array.isArray(b.arrows) || b.arrows.length < 1 || b.arrows.length > 150) return null;
  const arrows = [];
  for (const a of b.arrows) {
    if (!a || !Array.isArray(a.path) || a.path.length < 2 || a.path.length > 12) return null;
    const path = a.path.map(p => [int(p && p[0], 0, W - 1, -1), int(p && p[1], 0, H - 1, -1)]);
    if (path.some(p => p[0] < 0 || p[1] < 0)) return null;
    const dir = Array.isArray(a.dir) ? [int(a.dir[0], -1, 1, 0), int(a.dir[1], -1, 1, 0)] : null;
    if (!dir || !DIRS.some(d => d[0] === dir[0] && d[1] === dir[1])) return null;
    arrows.push({ path, dir, removed: !!a.removed, unlocked: !!a.unlocked });
  }
  return { W, H, arrows };
}
function cleanProgress(p) {
  if (!p || typeof p !== 'object' || typeof p.level !== 'number' || typeof p.score !== 'number') return null;
  const cats = {};
  CATS.forEach(k => { cats[k] = !!(p.cats && p.cats[k]); });
  if (!CATS.some(k => cats[k])) CATS.forEach(k => { cats[k] = true; });
  const st = p.stats && typeof p.stats === 'object' ? p.stats : {};
  const byCat = {};
  CATS.forEach(k => {
    const c = st.byCat && st.byCat[k];
    if (c) byCat[k] = { n: int(c.n, 0, 1e6, 0), ok: int(c.ok, 0, 1e6, 0) };
  });
  return {
    level: int(p.level, 1, 99, 1), score: int(p.score, 0, 1e7, 0), best: int(p.best, 0, 1e7, 0),
    lives: int(p.lives, 0, 5, 5), hints: int(p.hints, 0, 9, 3),
    qCount: int(p.qCount, 0, 1e6, 0), okCount: int(p.okCount, 0, 1e6, 0),
    lifeBonus: int(p.lifeBonus, 0, 1e4, 0), boom: int(p.boom, 0, 1e4, 0),
    cats,
    stats: { byCat, answered: int(st.answered, 0, 1e6, 0), correct: int(st.correct, 0, 1e6, 0),
             levelsCleared: int(st.levelsCleared, 0, 1e4, 0), maxLevel: int(st.maxLevel, 1, 99, 1) },
    board: cleanBoard(p.board),
    savedAt: int(p.savedAt, 0, 8.64e15, Date.now())
  };
}

module.exports = {
  ghGet, ghPut, pathOf, playerKey, codeHash, issueToken, keyFromRequest, safeEqual,
  throttled, noteFailure, clearFailures, cleanProgress
};
