/* bundle-akcia.js (breathune.eu) - prepína ceny podľa dátumu, aby sedeli s App Store.
   Black Friday 23. 11. - 30. 11. 2026 (slovenský čas): akciové ceny (data-bf="on"/"off")
   a pás s cenami hore na stránke. Bez JavaScriptu sa ukážu bežné ceny.
   Náhľad: na koniec adresy pridaj ?bf=1. Ak by sa akcia v App Store Connect zrušila, prepni BF_ZAPNUTE na false. */
(function () {
  var BF_ZAPNUTE = true;
  var BF = ['2026-11-23T00:00:00+01:00', '2026-12-01T00:00:00+01:00'];
  var ODKAZ = 'https://apps.apple.com/app-bundle/id6824159791';
  var PAS = {
    sk: 'Black Friday do 30. 11.: Breathune 49,99 € (bežne 69,99 €) · Zzzentinel 24,99 € (bežne 29,99 €) · obe v bundli 69,99 €',
    en: 'Black Friday until Nov 30: Breathune €49.99 (usually €69.99) · Zzzentinel €24.99 (usually €29.99) · both in a bundle €69.99',
    cs: 'Black Friday do 30. 11.: Breathune 49,99 € (běžně 69,99 €) · Zzzentinel 24,99 € (běžně 29,99 €) · obě v balíčku 69,99 €',
    de: 'Black Friday bis 30. 11.: Breathune 49,99 € (sonst 69,99 €) · Zzzentinel 24,99 € (sonst 29,99 €) · beide im Bundle 69,99 €',
    fr: 'Black Friday jusqu’au 30/11 : Breathune 49,99 € (au lieu de 69,99 €) · Zzzentinel 24,99 € (au lieu de 29,99 €) · les deux en lot 69,99 €',
    it: 'Black Friday fino al 30/11: Breathune 49,99 € (di solito 69,99 €) · Zzzentinel 24,99 € (di solito 29,99 €) · entrambe nel bundle 69,99 €',
    pl: 'Black Friday do 30.11: Breathune 49,99 € (zwykle 69,99 €) · Zzzentinel 24,99 € (zwykle 29,99 €) · obie w pakiecie 69,99 €',
    es: 'Black Friday hasta el 30/11: Breathune 49,99 € (normalmente 69,99 €) · Zzzentinel 24,99 € (normalmente 29,99 €) · las dos en un pack 69,99 €',
    pt: 'Black Friday até 30/11: Breathune 49,99 € (normalmente 69,99 €) · Zzzentinel 24,99 € (normalmente 29,99 €) · os dois no pacote 69,99 €'
  };

  var t = Date.now(), q = location.search;
  var bf = BF_ZAPNUTE && t >= Date.parse(BF[0]) && t < Date.parse(BF[1]);
  if (/[?&]bf=1/.test(q)) bf = true;
  if (/[?&]bf=0/.test(q)) bf = false;

  var el = document.querySelectorAll('[data-bf]');
  for (var i = 0; i < el.length; i++) {
    var skry = (el[i].getAttribute('data-bf') === 'on') !== bf;
    el[i].hidden = skry; el[i].style.display = skry ? 'none' : '';
  }

  if (bf && !document.getElementById('bf-pas')) {
    var a = document.createElement('a');
    a.id = 'bf-pas';
    a.href = ODKAZ.indexOf('{{') === 0 ? '/#bundle' : ODKAZ;
    if (a.href.indexOf('apps.apple.com') > 0) { a.target = '_blank'; a.rel = 'noopener'; }
    var lang = (document.documentElement.lang || 'sk').slice(0, 2);
    if (lang === 'sk') {
      // úvodná stránka má prepínač SK/EN, preto oba texty
      a.innerHTML = '<span class="sk">' + PAS.sk + '</span><span class="en">' + PAS.en + '</span>';
    } else {
      a.textContent = PAS[lang] || PAS.en;
    }
    a.style.cssText = 'display:block;position:relative;z-index:60;padding:10px 18px;text-align:center;font:600 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
      'color:#2b1e05;text-decoration:none;background:linear-gradient(100deg,#ffd9a0 0%,#f6b7a6 35%,#c9a2e6 70%,#8fdcd0 100%)';
    document.body.insertBefore(a, document.body.firstChild);
  }
})();
