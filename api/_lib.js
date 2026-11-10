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

async function ghList(dir, token) {
  const r = await fetch(`${API}/repos/${REPO}/contents/${dir}`, { headers: headers(token) });
  if (r.status === 404) return { items: [] };
  if (!r.ok) return { error: r.status };
  const d = await r.json();
  return { items: Array.isArray(d) ? d.filter(x => x.type === 'file' && x.name.endsWith('.json')) : [] };
}
async function ghDelete(path, sha, token, message) {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'DELETE', headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message || `delete ${path}`, sha })
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

// ---- administrateur : même mot de passe que les autres outils (empreinte SHA-256), vérifié côté serveur.
// ADMIN_HASH (variable Vercel) permet de le changer sans toucher au code.
const DEFAULT_ADMIN_HASH = 'f7ff32b790557d7601029bc0b296115f82e18d799b6e27ba0c6202fdbd1f2a08';
function checkAdminPassword(pw) {
  return safeEqual(sha256hex(pw || ''), (process.env.ADMIN_HASH || DEFAULT_ADMIN_HASH).toLowerCase());
}
function issueAdminToken() {
  const exp = Date.now() + 12 * 3600 * 1000;
  return `adm.${exp}.${hmac('admin:' + exp)}`;
}
function isAdmin(req) {
  const h = req.headers['authorization'] || '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [pre, exp, sig] = tok.split('.');
  if (pre !== 'adm' || !/^\d+$/.test(exp || '') || Number(exp) < Date.now() || !sig) return false;
  return safeEqual(sig, hmac('admin:' + exp));
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
const CATS = ['c','v','w','f','p','l','s','x','t','e'];
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
const int = (v, lo, hi, d) => { v = Math.floor(Number(v)); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
function cleanBoard(b) {
  if (!b || typeof b !== 'object') return null;
  const W = int(b.W, 5, 30, 0), H = int(b.H, 5, 30, 0);
  if (!W || !H || !Array.isArray(b.arrows) || b.arrows.length < 1 || b.arrows.length > 150) return null;
  const arrows = [];
  for (const a of b.arrows) {
    if (!a || !Array.isArray(a.path) || a.path.length < 1 || a.path.length > 40) return null;
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
  const DECOR_IDS = ['lantern', 'railing', 'flag', 'flowers', 'bench', 'bunting', 'statue'];
  const FISH_IDS = ['minnow', 'perch', 'trout', 'salmon', 'pike', 'carp'];
  const decor = Array.isArray(p.decor) ? DECOR_IDS.filter(id => p.decor.indexOf(id) >= 0) : [];
  const fish = {};
  FISH_IDS.forEach(id => { const n = int(p.fish && p.fish[id], 0, 1e5, 0); if (n > 0) fish[id] = n; });
  return {
    coins: int(p.coins, 0, 1e6, 0), upg: int(p.upg, 1, 6, 1), eup: int(p.eup, 1, 4, 1), lup: int(p.lup, 1, 4, 1), sup: int(p.sup, 1, 4, 1),
    ex: (function () {
      const e = p.ex && typeof p.ex === 'object' ? p.ex : {};
      const f = (arr, ids) => (Array.isArray(arr) ? ids.filter(id => arr.indexOf(id) >= 0) : []);
      const wo = f(e.wo, ['snow', 'rain', 'rainbow', 'aurora']);
      return { pk: f(e.pk, ['time', 'quick', 'magnet', 'lucky']), cs: f(e.cs, ['hat', 'shades', 'bow', 'crown']), rv: f(e.rv, ['boat', 'ducks', 'lantern', 'dolphin']), wo, wx: wo.indexOf(e.wx) >= 0 ? e.wx : '' };
    })(),
    inv: { shield: int(p.inv && p.inv.shield, 0, 99, 0), half: int(p.inv && p.inv.half, 0, 99, 0), freeze: int(p.inv && p.inv.freeze, 0, 99, 0) },
    mi: Array.isArray(p.mi) ? ['frame', 'easel', 'tapestry', 'curtain', 'spot', 'rope', 'plaque', 'glass', 'bench', 'vase', 'lustre', 'clock', 'camera', 'carpet', 'art2', 'guard'].filter(id => p.mi.indexOf(id) >= 0) : [],
    fx: Array.isArray(p.fx) ? ['fw', 'c_blue', 'c_rose', 'c_green', 'c_rainbow'].filter(id => p.fx.indexOf(id) >= 0) : [],
    lc: ['gold', 'blue', 'rose', 'green', 'rainbow'].indexOf(p.lc) >= 0 ? p.lc : 'gold',
    mode: ['eiffel', 'louvre', 'mona', 'liberty'].indexOf(p.mode) >= 0 ? p.mode : 'bridge', decor, fish,
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

// Word Bridge : progression stockée à part (champs wb / wbBest du même profil que Arrow Escape).
function cleanWbProgress(p) {
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
  const bitten = Array.isArray(p.bitten) ? p.bitten.slice(0, 10).map(v => int(v, 0, 29, -1)).filter(v => v >= 0) : [];
  return {
    level: int(p.level, 1, 99, 1), score: int(p.score, 0, 1e7, 0), best: int(p.best, 0, 1e7, 0),
    lives: int(p.lives, 0, 5, 5), placed: int(p.placed, 0, 30, 0), inLevel: !!p.inLevel, bitten,
    qCount: int(p.qCount, 0, 1e6, 0), okCount: int(p.okCount, 0, 1e6, 0),
    cats,
    stats: { byCat, answered: int(st.answered, 0, 1e6, 0), correct: int(st.correct, 0, 1e6, 0),
             levelsCleared: int(st.levelsCleared, 0, 1e4, 0), maxLevel: int(st.maxLevel, 1, 99, 1),
             gifts: int(st.gifts, 0, 1e6, 0), giftsOk: int(st.giftsOk, 0, 1e6, 0) },
    savedAt: int(p.savedAt, 0, 8.64e15, Date.now())
  };
}

// Noel (village de Noel) : progression stockee a part (champs xm / xmBest du meme profil).
const ID = /^[a-z0-9_]{1,24}$/;
const ids = (a, max) => Array.isArray(a) ? Array.from(new Set(a.filter(x => typeof x === 'string' && ID.test(x)))).slice(0, max) : [];
// Scramble : connecteurs collectés (compteur par mot) et records
function cleanScProgress(p) {
  if (!p || typeof p !== 'object') return null;
  const words = {};
  if (p.words && typeof p.words === 'object') {
    Object.keys(p.words).slice(0, 400).forEach(k => {
      if (/^[a-z][a-z' .-]{0,30}$/.test(k)) words[k] = int(p.words[k], 1, 1e5, 1);
    });
  }
  return {
    words, best: int(p.best, 0, 1e7, 0), runs: int(p.runs, 0, 1e6, 0), maxLoop: int(p.maxLoop, 1, 999, 1),
    destroyed: int(p.destroyed, 0, 1e6, 0), savedAt: int(p.savedAt, 0, 8.64e15, Date.now())
  };
}
function cleanXmProgress(p) {
  if (!p || typeof p !== 'object' || typeof p.day !== 'number' || typeof p.score !== 'number') return null;
  const cats = {};
  CATS.forEach(k => { cats[k] = !!(p.cats && p.cats[k]); });
  if (!CATS.some(k => cats[k])) CATS.forEach(k => { cats[k] = true; });
  const st = p.stats && typeof p.stats === 'object' ? p.stats : {};
  const byCat = {};
  CATS.forEach(k => {
    const c = st.byCat && st.byCat[k];
    if (c) byCat[k] = { n: int(c.n, 0, 1e6, 0), ok: int(c.ok, 0, 1e6, 0) };
  });
  const cu = {};
  if (p.cu && typeof p.cu === 'object') {
    Object.keys(p.cu).slice(0, 120).forEach(k => {
      const v = p.cu[k];
      if (/^[a-z0-9_]{1,16}$/.test(k) && typeof v === 'string' && /^[A-Za-z0-9_#.-]{0,20}$/.test(v)) cu[k] = v;
    });
  }
  const inv = p.inv && typeof p.inv === 'object' ? p.inv : {};
  return {
    coins: int(p.coins, 0, 1e7, 0), own: ids(p.own, 160), unl: ids(p.unl, 100), pk: ids(p.pk, 12), cs: ids(p.cs, 12), cu,
    inv: { shield: int(inv.shield, 0, 99, 0), half: int(inv.half, 0, 99, 0), freeze: int(inv.freeze, 0, 99, 0) },
    adv: Array.isArray(p.adv) ? Array.from(new Set(p.adv.map(n => int(n, 1, 24, 0)).filter(n => n > 0))) : [],
    qi: int(p.qi, 0, 200, 0), stg: int(p.stg, 1, 5, 1),
    day: int(p.day, 1, 9999, 1), score: int(p.score, 0, 1e7, 0), best: int(p.best, 0, 1e7, 0),
    lives: int(p.lives, 0, 5, 5), placed: int(p.placed, 0, 40, 0), inLevel: !!p.inLevel,
    qCount: int(p.qCount, 0, 1e6, 0), okCount: int(p.okCount, 0, 1e6, 0),
    cats,
    stats: { byCat, answered: int(st.answered, 0, 1e6, 0), correct: int(st.correct, 0, 1e6, 0),
             levelsCleared: int(st.levelsCleared, 0, 1e4, 0), maxLevel: int(st.maxLevel, 1, 9999, 1),
             gifts: int(st.gifts, 0, 1e6, 0), giftsOk: int(st.giftsOk, 0, 1e6, 0),
             maxStreak: int(st.maxStreak, 0, 1e5, 0), chests: int(st.chests, 0, 1e5, 0),
             takeoffs: int(st.takeoffs, 0, 1e5, 0), cust: int(st.cust, 0, 1e6, 0) },
    savedAt: int(p.savedAt, 0, 8.64e15, Date.now())
  };
}

module.exports = {
  ghGet, ghPut, ghList, ghDelete, DIR, checkAdminPassword, issueAdminToken, isAdmin, pathOf, playerKey, codeHash, issueToken, keyFromRequest, safeEqual,
  throttled, noteFailure, clearFailures, cleanProgress, cleanWbProgress, cleanXmProgress, cleanScProgress
};
