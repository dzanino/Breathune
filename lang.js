/* Jazyk webu.
   - Úvod je v slovenčine (/) a v angličtine (/en/) na samostatných adresách; podpora a zásady súkromia majú slovenčinu
     a angličtinu spolu a prepínajú sa tlačidlami (sk/en).
   - Čeština, nemčina, francúzština, taliančina, poľština, španielčina a portugalčina (Brazília) majú vlastné stránky v /cs/, /de/, /fr/, /it/, /pl/, /es/, /pt/.
   Voľba sa pamätá; bez voľby rozhoduje jazyk prehliadača (neznámy jazyk → angličtina, slovenčina → slovenčina). */
(function () {
  var root = document.documentElement;
  // Stránky len v slovenčine a angličtine (atribút data-sk-en, napr. Silent Companion) iné jazykové verzie nemajú, nepresmerúvame.
  var OWN = root.hasAttribute('data-sk-en') ? [] : ['cs', 'de', 'fr', 'it', 'pl', 'es', 'pt'];
  var KEY = 'breathune-lang';
  var script = document.currentScript;
  // Základ webu (breathune.eu/ aj dzanino.github.io/Breathune/) - odvodený od adresy tohto skriptu.
  var base = script && script.src ? script.src.replace(/lang\.js(\?.*)?$/, '') : location.origin + '/';

  function save(code) { try { localStorage.setItem(KEY, code); } catch (e) {} }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // Odkazy v prepínači si zapamätajú zvolený jazyk.
  document.querySelectorAll('.langbar a[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () { save(a.getAttribute('data-lang-link')); });
  });

  // Stránka v jednom jazyku (/cs/, /de/ … alebo článok) - nič neprepíname.
  var fixed = root.getAttribute('data-fixed-lang');
  if (fixed) { save(fixed); return; }

  // Slovenský úvod (od 9. 11. 2026 len slovensky). Na inú jazykovú verziu presmerujeme len podľa výslovnej voľby
  // (?lang= alebo jazyk, ktorý si človek predtým vybral), nie podľa jazyka prehliadača, aby vyhľadávače videli slovenský úvod.
  if (root.hasAttribute('data-home-sk')) {
    var q = (location.search.match(/[?&]lang=([a-z]{2})\b/) || [])[1];
    if (q === 'sk') { save('sk'); return; }
    var w = q || saved();
    var ciel = w === 'en' ? 'en/' : (OWN.indexOf(w) >= 0 ? w + '/' : null);
    if (ciel && location.href.indexOf(base) === 0) location.replace(base + ciel + location.hash);
    return;
  }
  var buttons = document.querySelectorAll('.langbar button[data-set]');
  if (!buttons.length) return;

  function setLang(code) {
    root.setAttribute('data-lang', code);
    root.setAttribute('lang', code);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.set === code)); });
    save(code);
  }

  var query = (location.search.match(/[?&]lang=([a-z]{2})\b/) || [])[1];
  var browser = (navigator.language || 'sk').toLowerCase().slice(0, 2);
  var wanted = query || saved() || browser;

  // Vlastná jazyková verzia existuje → presmeruj na ňu (len keď si ju človek práve nevypol parametrom ?lang=).
  if (!query && OWN.indexOf(wanted) >= 0 && location.href.indexOf(base) === 0) {
    var rest = location.href.slice(base.length).replace(/[?#].*$/, '');
    location.replace(base + wanted + '/' + rest + location.hash);
    return;
  }
  // Úvodná stránka má od 1. 11. 2026 samostatnú anglickú verziu /en/: angličtina na úvode → presmeruj tam.
  var rest0 = location.href.indexOf(base) === 0 ? location.href.slice(base.length).replace(/[?#].*$/, '') : null;
  var isHome = rest0 === '' || rest0 === 'index.html';
  var lang0 = wanted === 'sk' || (wanted !== 'en' && browser === 'sk') ? 'sk' : 'en';
  if (isHome && lang0 === 'en' && !query) { save('en'); location.replace(base + 'en/' + location.hash); return; }
  setLang(lang0);

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (isHome && b.dataset.set === 'en') { save('en'); location.href = base + 'en/'; return; }
      setLang(b.dataset.set);
    });
  });
})();
