/* Silent Companion - interaktívne ukážky na stránke appky (bez mikrofónu, s pripravenými vetami). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'sk'; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- Ukážka tituliek v telefóne ---------- */
  var SCENES = {
    bar: {
      from: { sk: 'Španielčina', en: 'Spanish', flag: '🇪🇸' },
      lines: [
        ['¿Qué os pongo para beber?', 'Čo vám dám na pitie?', 'What can I get you to drink?'],
        ['Hoy tenemos paella de marisco.', 'Dnes máme paellu s morskými plodmi.', 'Today we have seafood paella.'],
        ['Tarda unos veinte minutos.', 'Trvá asi dvadsať minút.', 'It takes about twenty minutes.'],
        ['¿Queréis probar el vino de la casa?', 'Chcete ochutnať domáce víno?', 'Would you like to try the house wine?'],
        ['La cocina cierra a las once.', 'Kuchyňa zatvára o jedenástej.', 'The kitchen closes at eleven.']
      ]
    },
    doctor: {
      from: { sk: 'Taliančina', en: 'Italian', flag: '🇮🇹' },
      lines: [
        ['Da quanti giorni ha la febbre?', 'Koľko dní máte horúčku?', 'How many days have you had a fever?'],
        ['Prenda una compressa due volte al giorno.', 'Užívajte jednu tabletu dvakrát denne.', 'Take one tablet twice a day.'],
        ['Sempre dopo i pasti.', 'Vždy po jedle.', 'Always after meals.'],
        ['Se non migliora, torni giovedì.', 'Ak sa to nezlepší, príďte vo štvrtok.', 'If it doesn’t get better, come back on Thursday.'],
        ['Beva molta acqua e riposi.', 'Pite veľa vody a oddychujte.', 'Drink plenty of water and rest.']
      ]
    },
    lecture: {
      from: { sk: 'Angličtina', en: 'English', flag: '🇬🇧' },
      lines: [
        ['Today we will look at how enzymes work.', 'Dnes sa pozrieme, ako fungujú enzýmy.', 'Heute schauen wir uns an, wie Enzyme funktionieren.'],
        ['An enzyme lowers the activation energy.', 'Enzým znižuje aktivačnú energiu.', 'Ein Enzym senkt die Aktivierungsenergie.'],
        ['This makes the reaction much faster.', 'Vďaka tomu je reakcia oveľa rýchlejšia.', 'Dadurch läuft die Reaktion viel schneller ab.'],
        ['Temperature and pH change its activity.', 'Teplota a pH menia jeho aktivitu.', 'Temperatur und pH-Wert verändern seine Aktivität.'],
        ['We will test this in the lab on Friday.', 'V piatok si to overíme v laboratóriu.', 'Am Freitag testen wir das im Labor.']
      ]
    }
  };
  // Prednáška v angličtine: titulky po slovensky, v anglickej verzii stránky do nemčiny (aby bolo vidieť preklad).
  var TARGET = { sk: { name: 'Slovenčina', flag: '🇸🇰' }, en: { name: 'English', flag: '🇬🇧' } };
  var TARGET_LECTURE_EN = { name: 'Deutsch', flag: '🇩🇪' };
  var SOURCE_LECTURE = { sk: 'Angličtina', en: 'English', flag: '🇬🇧' };

  var phone = document.querySelector('[data-demo]');
  if (phone) {
    var feed = phone.querySelector('.feed');
    var partial = phone.querySelector('.partial-text');
    var fromEl = phone.querySelector('[data-from]');
    var toEl = phone.querySelector('[data-to]');
    var listenBtn = phone.querySelector('.listen');
    var voiceBtn = phone.querySelector('[data-voice]');
    var sceneBtns = document.querySelectorAll('.scenarios button[data-scene]');
    var scene = 'bar', idx = 0, playing = false, timers = [], shown = [], voice = false, started = false;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function translation(line) { return lang() === 'en' ? line[2] : line[1]; }
    function setBridge() {
      var s = SCENES[scene], l = lang();
      var src = scene === 'lecture' ? SOURCE_LECTURE : s.from;
      var tgt = scene === 'lecture' && l === 'en' ? TARGET_LECTURE_EN : TARGET[l];
      fromEl.textContent = src.flag + ' ' + src[l];
      toEl.textContent = tgt.flag + ' ' + tgt.name;
    }
    function render() {
      feed.textContent = '';
      shown.slice(-4).forEach(function (item, i, arr) {
        var card = el('div', 'line' + (i === arr.length - 1 ? ' latest' : ''));
        if (item.pending) {
          var t = el('span', 'typing'); t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
          card.appendChild(t);
        } else {
          card.appendChild(el('div', 'tr', translation(item.line)));
        }
        card.appendChild(el('div', 'or', item.line[0]));
        if (reduce || !item.fresh) card.style.animation = 'none';
        item.fresh = false;
        feed.appendChild(card);
      });
    }
    function speak(text) {
      if (!voice || !('speechSynthesis' in window)) return;
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang() === 'en' ? (scene === 'lecture' ? 'de-DE' : 'en-GB') : 'sk-SK';
        u.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
    function step() {
      if (!playing) return;
      var lines = SCENES[scene].lines;
      if (idx >= lines.length) {
        later(function () { shown = []; idx = 0; render(); step(); }, 2600);
        return;
      }
      var line = lines[idx];
      var words = line[0].split(' ');
      var w = 0;
      (function typeWord() {
        if (!playing) return;
        w++;
        partial.textContent = words.slice(0, w).join(' ');
        if (w < words.length) { later(typeWord, reduce ? 60 : 230); return; }
        later(function () {
          partial.textContent = '';
          var item = { line: line, pending: true, fresh: true };
          shown.push(item); render();
          later(function () {
            item.pending = false; render();
            speak(translation(line));
            idx++;
            later(step, 1500);
          }, 650);
        }, 380);
      })();
    }
    function setPlaying(on) {
      playing = on;
      phone.classList.toggle('playing', on);
      listenBtn.setAttribute('aria-pressed', String(on));
      listenBtn.setAttribute('aria-label', on ? (lang() === 'en' ? 'Stop' : 'Zastaviť') : (lang() === 'en' ? 'Listen' : 'Počúvať'));
      clearTimers();
      if (on) { step(); } else { partial.textContent = ''; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
    }
    function choose(name) {
      scene = name; idx = 0; shown = [];
      sceneBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.scene === name)); });
      setBridge(); render();
      setPlaying(true);
    }
    sceneBtns.forEach(function (b) { b.addEventListener('click', function () { started = true; choose(b.dataset.scene); }); });
    listenBtn.addEventListener('click', function () { started = true; setPlaying(!playing); });
    if (voiceBtn) {
      if (!('speechSynthesis' in window)) voiceBtn.hidden = true;
      voiceBtn.addEventListener('click', function () {
        voice = !voice;
        voiceBtn.setAttribute('aria-pressed', String(voice));
        if (!voice && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      });
    }
    setBridge();
    if (reduce) {
      // Bez pohybu: ukáž hotový rozhovor, ťuknutím na Počúvať sa dá spustiť aj tak.
      shown = SCENES.bar.lines.slice(0, 4).map(function (l) { return { line: l, pending: false, fresh: false }; });
      idx = 4; render();
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) { started = true; setPlaying(true); }
          if (!en.isIntersecting && playing) setPlaying(false);
          if (en.isIntersecting && started && !playing && phone.dataset.autoresume === '1') setPlaying(true);
          phone.dataset.autoresume = en.isIntersecting ? '0' : (playing ? '1' : phone.dataset.autoresume);
        });
      }, { threshold: 0.4 });
      io.observe(phone);
    }
    new MutationObserver(function () { setBridge(); render(); setPlaying(playing); }).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
  }

  /* ---------- Rozhovor dvoch ľudí ---------- */
  var TALK = [
    ['me', 'Dobrý deň, potrebujem niečo na kašeľ.', 'Buongiorno, mi serve qualcosa per la tosse.', 'Hello, I need something for a cough.'],
    ['other', 'Tosse secca o con catarro?', 'Suchý kašeľ, alebo s hlienom?', 'A dry cough, or with phlegm?'],
    ['me', 'Suchý, hlavne v noci.', 'Secca, soprattutto di notte.', 'Dry, mostly at night.'],
    ['other', 'Allora le consiglio questo sciroppo.', 'Tak vám odporúčam tento sirup.', 'Then I recommend this syrup.'],
    ['me', 'Koľkokrát denne?', 'Quante volte al giorno?', 'How many times a day?'],
    ['other', 'Tre volte, dopo i pasti.', 'Trikrát, po jedle.', 'Three times, after meals.']
  ];
  var chat = document.querySelector('[data-chat]');
  if (chat) {
    var cfeed = chat.querySelector('.chat-feed');
    var nextBtn = chat.querySelector('[data-next]');
    var resetBtn = chat.querySelector('[data-reset]');
    var turn = 0;
    function who(side) {
      var en = lang() === 'en';
      return side === 'me' ? (en ? 'You' : 'Ty') : (en ? 'Pharmacist (Italian)' : 'Lekárnik (taliansky)');
    }
    function bubble(t, fresh) {
      var en = lang() === 'en';
      var b = el('div', 'bub ' + t[0]);
      b.appendChild(el('div', 'who', who(t[0])));
      // Moja veta: čo som povedal (moja reč) a čo počuje lekárnik (taliansky). Jeho veta: preklad pre mňa a jeho originál.
      if (t[0] === 'me') {
        b.appendChild(el('div', 'tr', t[2]));
        b.appendChild(el('div', 'or', en ? t[3] : t[1]));
      } else {
        b.appendChild(el('div', 'tr', en ? t[3] : t[2]));
        b.appendChild(el('div', 'or', t[1]));
      }
      if (!fresh || reduce) b.style.animation = 'none';
      return b;
    }
    function drawAll() {
      cfeed.textContent = '';
      TALK.slice(0, turn).slice(-4).forEach(function (t) { cfeed.appendChild(bubble(t, false)); });
    }
    function next() {
      if (turn >= TALK.length) { turn = 0; cfeed.textContent = ''; }
      turn++;
      cfeed.textContent = '';
      TALK.slice(0, turn).slice(-4).forEach(function (t, i, arr) { cfeed.appendChild(bubble(t, i === arr.length - 1)); });
    }
    nextBtn.addEventListener('click', next);
    resetBtn.addEventListener('click', function () { turn = 0; cfeed.textContent = ''; next(); });
    next(); next();
    new MutationObserver(drawAll).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
  }

  /* ---------- Hľadanie v archíve (Plus) ---------- */
  var RECORDS = [
    { t: { sk: 'Biochémia: enzýmy', en: 'Biochemistry: enzymes' }, m: { sk: '12. 11. · Angličtina → Slovenčina · 48 min', en: '12 Nov · English → German · 48 min' },
      s: { sk: ['Enzým znižuje aktivačnú energiu.', 'Teplota a pH menia jeho aktivitu.', 'V piatok si to overíme v laboratóriu.'],
           en: ['An enzyme lowers the activation energy.', 'Temperature and pH change its activity.', 'We will test this in the lab on Friday.'] } },
    { t: { sk: 'Lekáreň v Ríme', en: 'Pharmacy in Rome' }, m: { sk: '3. 10. · Konverzácia · Taliančina', en: '3 Oct · Conversation · Italian' },
      s: { sk: ['Suchý kašeľ, alebo s hlienom?', 'Tak vám odporúčam tento sirup.', 'Trikrát denne, po jedle.'],
           en: ['A dry cough, or with phlegm?', 'Then I recommend this syrup.', 'Three times a day, after meals.'] } },
    { t: { sk: 'Porada s dodávateľom', en: 'Meeting with the supplier' }, m: { sk: '28. 9. · Nemčina → Slovenčina · 35 min', en: '28 Sep · German → English · 35 min' },
      s: { sk: ['Dodávka príde v piatok do obeda.', 'Cena platí do konca roka.', 'Laboratórne výsledky pošleme e-mailom.'],
           en: ['The delivery arrives on Friday before noon.', 'The price is valid until the end of the year.', 'We will email the lab results.'] } }
  ];
  var arch = document.querySelector('[data-archive]');
  if (arch) {
    var input = arch.querySelector('input');
    var list = arch.querySelector('.records');
    var count = arch.querySelector('.count');
    function fold(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function mark(text, q) {
      var f = fold(text), i = q ? f.indexOf(q) : -1, frag = document.createDocumentFragment();
      if (i < 0) { frag.appendChild(document.createTextNode(text)); return frag; }
      frag.appendChild(document.createTextNode(text.slice(0, i)));
      frag.appendChild(el('mark', null, text.slice(i, i + q.length)));
      frag.appendChild(document.createTextNode(text.slice(i + q.length)));
      return frag;
    }
    function search() {
      var l = lang(), q = fold(input.value.trim()), n = 0;
      list.textContent = '';
      RECORDS.forEach(function (r) {
        var hits = q ? r.s[l].filter(function (s) { return fold(s).indexOf(q) >= 0; }) : [r.s[l][0]];
        var titleHit = q && fold(r.t[l]).indexOf(q) >= 0;
        if (q && !hits.length && !titleHit) return;
        n++;
        var card = el('div', 'rec');
        var t = el('div', 't'); t.appendChild(mark(r.t[l], q)); card.appendChild(t);
        card.appendChild(el('div', 'm', r.m[l]));
        (hits.length ? hits : [r.s[l][0]]).forEach(function (s) { var h = el('div', 'hit'); h.appendChild(mark('“' + s + '”', q)); card.appendChild(h); });
        list.appendChild(card);
      });
      if (!n) list.appendChild(el('div', 'rec-none', l === 'en' ? 'Nothing found. Try “syrup” or “Friday”.' : 'Nič sa nenašlo. Skús „sirup“ alebo „piatok“.'));
      count.textContent = q ? (l === 'en' ? 'Found in ' + n + ' of 3 records' : 'Nájdené v ' + n + ' z 3 záznamov') : '';
    }
    input.addEventListener('input', search);
    arch.querySelectorAll('.chips button').forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.textContent.trim(); search(); input.focus(); });
    });
    search();
    new MutationObserver(function () { input.placeholder = lang() === 'en' ? input.dataset.phEn : input.dataset.phSk; search(); })
      .observe(root, { attributes: true, attributeFilter: ['data-lang'] });
    input.placeholder = lang() === 'en' ? input.dataset.phEn : input.dataset.phSk;
  }
})();
