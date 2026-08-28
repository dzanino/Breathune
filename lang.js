/* Prepínanie jazyka. Voľba sa pamätá, takže platí naprieč všetkými stránkami. */
(function () {
  var root = document.documentElement;

  function setLang(code) {
    root.setAttribute('data-lang', code);
    root.setAttribute('lang', code);
    document.querySelectorAll('.langbar button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === code));
    });
    try { localStorage.setItem('breathune-lang', code); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('breathune-lang'); } catch (e) {}
  // Bez uloženej voľby sa riadime jazykom prehliadača; slovenčina je predvolená.
  setLang(saved || ((navigator.language || 'sk').toLowerCase().indexOf('sk') === 0 ? 'sk' : 'en'));

  document.querySelectorAll('.langbar button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.set); });
  });
})();
