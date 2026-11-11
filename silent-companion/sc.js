/* Silent Companion - interaktívne ukážky na stránke appky (bez mikrofónu, s pripravenými vetami). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'sk'; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- Ukážka v telefóne: skutočný rozhovor dvoch ľudí ---------- */
  // Každá veta: kto hovorí ('me' = návštevník stránky, 'other' = cudzinec), jeho slová po slovensky (sk),
  // po anglicky (en) a v jazyku cudzinca (x). Moju vetu appka preloží do x, cudzincovu do sk alebo en.
  var SCENES = {
    restaurant: {
      x: { sk: 'Španielčina', en: 'Spanish', flag: '🇪🇸', voice: 'es-ES' },
      who: { me: { sk: 'Hosť', en: 'Guest' }, other: { sk: 'Čašník', en: 'Waiter' } },
      lines: [
        ['me', 'Dobrý deň, radi by sme si objednali.', 'Good afternoon, we’d like to order.', 'Buenas tardes, nos gustaría pedir.'],
        ['other', '¡Buenas tardes! Claro, ahora mismo estoy con ustedes.', 'Dobrý deň! Jasné, hneď som u vás.', 'Good afternoon! Of course, I’ll be right with you.'],
        ['other', 'Les escucho, ¿qué les pongo?', 'Počúvam, čo si dáte?', 'I’m listening, what can I get you?'],
        ['me', 'Poprosíme si dve paelly s morskými plodmi.', 'Two seafood paellas, please.', 'Dos paellas de marisco, por favor.'],
        ['other', 'Muy bien. La paella tarda unos veinte minutos, ¿les parece bien?', 'Výborne. Paella trvá asi dvadsať minút, vyhovuje vám to?', 'Very good. The paella takes about twenty minutes, is that all right?'],
        ['me', 'Áno, nevadí. Medzitým si dáme chlieb s olivami.', 'Yes, that’s fine. Meanwhile we’ll have bread with olives.', 'Sí, no pasa nada. Mientras tanto, pan con aceitunas.'],
        ['other', '¿Y para beber? El vino de la casa es muy bueno.', 'A na pitie? Domáce víno je veľmi dobré.', 'And to drink? The house wine is very good.'],
        ['me', 'Tak dva poháre červeného a džbán vody.', 'Then two glasses of red and a jug of water.', 'Entonces dos copas de tinto y una jarra de agua.'],
        ['other', '¡Perfecto! Enseguida se lo traigo.', 'Výborne! Hneď vám to prinesiem.', 'Perfect! I’ll bring it right away.']
      ]
    },
    doctor: {
      x: { sk: 'Taliančina', en: 'Italian', flag: '🇮🇹', voice: 'it-IT' },
      who: { me: { sk: 'Pacient', en: 'Patient' }, other: { sk: 'Lekárka', en: 'Doctor' } },
      lines: [
        ['other', 'Buongiorno, si accomodi. Cosa la porta qui?', 'Dobrý deň, posaďte sa. Čo vás trápi?', 'Good morning, have a seat. What brings you here?'],
        ['me', 'Od včera mám horúčku a bolí ma hrdlo.', 'I’ve had a fever and a sore throat since yesterday.', 'Da ieri ho la febbre e mal di gola.'],
        ['other', 'Quanto è alta la febbre?', 'Akú vysokú horúčku máte?', 'How high is the fever?'],
        ['me', 'Ráno som mal 38,5.', 'This morning it was 38.5.', 'Stamattina avevo trentotto e mezzo.'],
        ['other', 'Apra la bocca, per favore. Sì, la gola è molto arrossata.', 'Otvorte, prosím, ústa. Áno, hrdlo je veľmi začervenané.', 'Open your mouth, please. Yes, your throat is very red.'],
        ['me', 'Je to niečo vážne?', 'Is it something serious?', 'È qualcosa di grave?'],
        ['other', 'No, è una faringite. Le prescrivo un antibiotico.', 'Nie, je to zápal hltana. Predpíšem vám antibiotikum.', 'No, it’s pharyngitis. I’ll prescribe an antibiotic.'],
        ['other', 'Una compressa due volte al giorno, per sei giorni.', 'Jedna tableta dvakrát denne, šesť dní.', 'One tablet twice a day, for six days.'],
        ['me', 'V sobotu letím domov. Môžem?', 'I’m flying home on Saturday. Is that all right?', 'Sabato torno a casa in aereo. Posso?'],
        ['other', 'Sì, se la febbre passa. Beva molto e riposi.', 'Áno, ak horúčka prejde. Veľa pite a oddychujte.', 'Yes, if the fever goes away. Drink plenty and rest.']
      ]
    },
    bar: {
      x: { sk: 'Nemčina', en: 'German', flag: '🇩🇪', voice: 'de-DE' },
      who: { me: { sk: 'Ty', en: 'You' }, other: { sk: 'Turista z Mníchova', en: 'Tourist from Munich' } },
      lines: [
        ['me', 'Prepáčte, myslím, že pijete moje pivo.', 'Excuse me, I think you’re drinking my beer.', 'Entschuldigung, ich glaube, Sie trinken mein Bier.'],
        ['other', 'Oh nein! Ich dachte schon, heute schmeckt es besonders gut.', 'Ach nie! Už som si myslel, že dnes chutí obzvlášť dobre.', 'Oh no! I was just thinking it tasted especially good today.'],
        ['me', 'Nevadí, aspoň viem, že som si vybral dobre.', 'No worries, at least I know I chose well.', 'Kein Problem, so weiß ich wenigstens, dass ich gut gewählt habe.'],
        ['other', 'Die nächste Runde geht auf mich. Zwei Bier, bitte!', 'Ďalšie kolo platím ja. Dve pivá, prosím!', 'The next round is on me. Two beers, please!'],
        ['other', 'Und diesmal stelle ich meins auf die andere Seite.', 'A tentokrát si to svoje postavím na druhú stranu.', 'And this time I’ll put mine on the other side.'],
        ['me', 'Odkiaľ ste?', 'Where are you from?', 'Woher kommen Sie?'],
        ['other', 'Aus München. Und Sie?', 'Z Mníchova. A vy?', 'From Munich. And you?'],
        ['me', 'Z Bratislavy. Je to od vás len kúsok.', 'From Bratislava. It’s not far from you.', 'Aus Bratislava. Das ist gar nicht weit von Ihnen.'],
        ['other', 'Dann trinken wir auf die Nachbarn. Prost!', 'Tak pripime na susedov. Na zdravie!', 'Then let’s drink to the neighbours. Cheers!'],
        ['me', 'Na zdravie! A toto pivo si už ustrážim.', 'Cheers! And this one I’m keeping an eye on.', 'Prost! Und auf dieses Bier passe ich jetzt auf.']
      ]
    }
  };
  var MINE = { sk: { name: 'Slovenčina', flag: '🇸🇰', voice: 'sk-SK' }, en: { name: 'English', flag: '🇬🇧', voice: 'en-GB' } };

  var phone = document.querySelector('[data-demo]');
  if (phone) {
    var feed = phone.querySelector('.feed');
    var partial = phone.querySelector('.partial-text');
    var fromEl = phone.querySelector('[data-from]');
    var toEl = phone.querySelector('[data-to]');
    var listenBtn = phone.querySelector('.listen');
    var voiceBtn = phone.querySelector('[data-voice]');
    var sceneBtns = document.querySelectorAll('.scenarios button[data-scene]');
    var scene = 'restaurant', idx = 0, playing = false, timers = [], shown = [], voice = false, started = false;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    // What the speaker said (in their language) and what the other person reads (the translation).
    function original(line) { return line[0] === 'me' ? (lang() === 'en' ? line[2] : line[1]) : line[1]; }
    function translation(line) { return line[0] === 'me' ? line[3] : (lang() === 'en' ? line[3] : line[2]); }
    function voiceOf(line) { return line[0] === 'me' ? SCENES[scene].x.voice : MINE[lang()].voice; }
    function setBridge() {
      var s = SCENES[scene], l = lang();
      fromEl.textContent = MINE[l].flag + ' ' + MINE[l].name;
      toEl.textContent = s.x.flag + ' ' + s.x[l];
    }
    function render() {
      feed.textContent = '';
      var who = SCENES[scene].who;
      shown.slice(-4).forEach(function (item, i, arr) {
        var side = item.line[0];
        var card = el('div', 'line ' + side + (i === arr.length - 1 ? ' latest' : ''));
        card.appendChild(el('div', 'who', who[side][lang()]));
        if (item.pending) {
          var t = el('span', 'typing'); t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
          card.appendChild(t);
        } else {
          card.appendChild(el('div', 'tr', translation(item.line)));
        }
        card.appendChild(el('div', 'or', original(item.line)));
        if (reduce || !item.fresh) card.style.animation = 'none';
        item.fresh = false;
        feed.appendChild(card);
      });
    }
    function speak(line) {
      if (!voice || !('speechSynthesis' in window)) return;
      try {
        var u = new SpeechSynthesisUtterance(translation(line));
        u.lang = voiceOf(line);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
    function step() {
      if (!playing) return;
      var lines = SCENES[scene].lines;
      if (idx >= lines.length) {
        later(function () { shown = []; idx = 0; render(); step(); }, 3200);
        return;
      }
      var line = lines[idx];
      var words = original(line).split(' ');
      var w = 0;
      phone.classList.toggle('me-speaks', line[0] === 'me');
      (function typeWord() {
        if (!playing) return;
        w++;
        partial.textContent = words.slice(0, w).join(' ');
        if (w < words.length) { later(typeWord, reduce ? 60 : 210); return; }
        later(function () {
          partial.textContent = '';
          var item = { line: line, pending: true, fresh: true };
          shown.push(item); render();
          later(function () {
            item.pending = false; render();
            speak(line);
            idx++;
            later(step, voice ? 2600 : 1700);
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
      // Bez pohybu: ukáž hotový začiatok rozhovoru, ťuknutím na Počúvať sa dá spustiť aj tak.
      shown = SCENES.restaurant.lines.slice(0, 4).map(function (l) { return { line: l, pending: false, fresh: false }; });
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
