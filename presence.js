// Signal de présence : indique au serveur que l'élève connecté a une page du jeu ouverte (toutes les 60 s, onglet visible).
// Ne fait rien si l'élève n'est pas connecté. Aucune donnée de jeu n'est envoyée.
(function () {
  var API = (location.protocol === 'file:' || /claude/.test(location.hostname)) ? 'https://letsplay-nine.vercel.app/api/player' : '/api/player';
  var MAP = { hub: 'hub', scramble: 'sc', toeicnoid: 'tn', toeicdig: 'td', toeicgalaxy: 'tg', toeicrunner: 'tr', toeicgrid: 'cg', wordbridge: 'wb', noel: 'xm' };
  var seg = (location.pathname.split('/').filter(Boolean)[0] || '').replace(/\.html$/, '').toLowerCase();
  var game = MAP[seg] || (seg && seg !== 'index' ? 'hub' : 'ae');
  var dead = false;
  function ping() {
    if (dead || document.hidden) return;
    var s = null; try { s = JSON.parse(localStorage.getItem('letsplaySession') || 'null'); } catch (e) {}
    if (!s || !s.token) return;
    try {
      fetch(API, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.token }, body: JSON.stringify({ action: 'ping', game: game, nom: s.user && s.user.nom }) })
        .then(function (r) { if (r.status === 401) dead = true; }, function () {});
    } catch (e) {}
  }
  setTimeout(ping, 1500 + Math.random() * 6000);           // étale les arrivées quand toute une classe ouvre la page
  setInterval(ping, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(ping, Math.random() * 2000); });
})();
