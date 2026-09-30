/* Jazyk webu.
   - Slovenčina a angličtina sú na hlavných stránkach spolu a prepínajú sa tlačidlami (sk/en).
   - Čeština, nemčina, francúzština, taliančina a poľština majú vlastné stránky v /cs/, /de/, /fr/, /it/, /pl/.
   Voľba sa pamätá; bez voľby rozhoduje jazyk prehliadača (neznámy jazyk → angličtina, slovenčina → slovenčina). */
(function () {
  var root = document.documentElement;
  var OWN = ['cs', 'de', 'fr', 'it', 'pl'];
  var KEY = 'breathune-lang';
  var script = document.currentScript;
  // Základ webu (breathune.eu/ aj dzanino.github.io/Breathune/) – odvodený od adresy tohto skriptu.
  var base = script && script.src ? script.src.replace(/lang\.js(\?.*)?$/, '') : location.origin + '/';

  function save(code) { try { localStorage.setItem(KEY, code); } catch (e) {} }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // Odkazy v prepínači si zapamätajú zvolený jazyk.
  document.querySelectorAll('.langbar a[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () { save(a.getAttribute('data-lang-link')); });
  });

  // Stránka v jednom jazyku (/cs/, /de/ … alebo článok) – nič neprepíname.
  var fixed = root.getAttribute('data-fixed-lang');
  if (fixed) { save(fixed); return; }
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
  setLang(wanted === 'sk' || (wanted !== 'en' && browser === 'sk') ? 'sk' : 'en');

  buttons.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.set); }); });
})();
