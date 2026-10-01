/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'fusaglia',
    /* nessun WhatsApp: il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (tabella, 30/9/2026) e TuttaMilano: lunedì–venerdì 8:30–12:30 e 14:30–19, sabato e domenica chiuso */
    hours: {
      0: [], 1: [['08:30', '12:30'], ['14:30', '19:00']], 2: [['08:30', '12:30'], ['14:30', '19:00']], 3: [['08:30', '12:30'], ['14:30', '19:00']],
      4: [['08:30', '12:30'], ['14:30', '19:00']], 5: [['08:30', '12:30'], ['14:30', '19:00']], 6: [],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Fusaglia: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.servizi": "What we do",
      "n.bottega": "Under the vault",
      "n.storia": "Since 1910",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.bottega": "Historic shop of Milan",
      "h.sopra": "Via Zebedia 2 bis, a few steps from Piazza Missori",
      "h.titolo": "Keys, locks and safes, since 1910",
      "h.seconda": "«[…] right in the centre, a few steps from the Madonnina.»",
      "h.testo": "A family shop under the brick vault of Via Zebedia: keys cut at the counter, mechanical and electronic locks, armoured doors, safes and access control.",
      "h.voto": "on Google, 89 reviews",
      "h.chi": "Stefano D., in a review on Google (in English: «[…] an old historic shop in the centre of Milan that has everything inside, from a simple key with a padlock to the most high-tech safe.»)",
      "p.titolo": "The safe",
      "p.desc": "A burgundy and cream safe, like the ones in the tower in our shop, against the whitewashed brick vault. It opens in three ways: with the combination (the dial turns right to 19 and left to 10), with the double-bit key (two turns) or with the code on the keypad (1910, then the green light). The handle turns and the door swings open: inside, the shelf, the papers, a jewellery box and the drawer; on the back of the door, the bolts and the mechanism.",
      "p.d0": "Combination: the dial right to 19, then left to 10.",
      "p.d1": "Key: the double-bit key goes in and turns twice.",
      "p.d2": "Electronic: the code on the keypad, then the green light.",
      "p.modi": "How it opens",
      "p.b0": "Combination",
      "p.b1": "Key",
      "p.b2": "Electronic",
      "p.nota": "One of the safes in our tower, in three versions. The combination is 19 and 10: like 1910.",
      "s.etichetta": "What we do",
      "s.titolo": "From the key at the counter to the armoured door",
      "s.frase": "«Security does not depend on the type of system used, but on the quality, method and installation care that raise a system from “normal” to high security.»",
      "a.chiavi": "Our key blanks hanging on the bar, with the name FUSAGLIA stamped on the head.",
      "k.chiavi": "Our key blanks: the name is on the head.",
      "s.c1": "Keys",
      "s.c1t": "Sale and cutting. «We can copy every key in circulation, except for the various customised ones on the market.»",
      "s.c2": "Locks",
      "s.c2t": "Mechanical and electronic: sale, installation and service, openings and replacements.",
      "s.c3": "Armoured doors",
      "s.c3t": "Sale and installation. «Security is not a matter of chance, but a conscious and today necessary choice.»",
      "s.c4": "Safes",
      "s.c4t": "Wall, freestanding and floor safes; security and armoured cabinets for offices, goldsmiths and jewellers.",
      "s.c5": "Access control",
      "s.c5t": "Fusaglia Mechatronic Systems, our branch for electronic locks and access control: «In 2019 a new branch is born from the heart of the Fusaglia company […]»",
      "s.c6": "Remote controls",
      "s.c6t": "«We can copy almost all remote controls, whether for cars, alarms or driveway gates […]»",
      "s.c7": "Gates and grilles",
      "s.c7t": "Sale and installation. «All models can be built to the customer’s needs.»",
      "s.c8": "Hardware",
      "s.c8t": "At the counter: small hardware, tools, padlocks, brass handles and escutcheons.",
      "s.nota": "No prices here: for a quote, call us or drop into the shop.",
      "b.etichetta": "Under the vault",
      "b.titolo": "A few steps down, and you are in the shop",
      "b.frase": "The shop is below street level: the whitewashed brick vault, the red floor, the yellow and black stripes on the edge of the steps. On the walls the key blanks, the brass handles and the tower of safes; at the counter the key-cutting machines.",
      "a.volta": "The shop under the whitewashed brick vault: the red floor, the steps, the safes and a wrought-iron table.",
      "k.volta": "The vault and the steps",
      "a.casseforti": "The tower of burgundy and cream safes: combination, key and keypad.",
      "k.casseforti": "The tower of safes",
      "a.duplicatrici": "The key-cutting machines on the red counter; behind them, the wall of key blanks.",
      "k.duplicatrici": "The key-cutting machines, at the counter",
      "a.maniglie": "Brass handles and escutcheons on the panel.",
      "k.maniglie": "The brass handles",
      "t1.etichetta": "Since 1910",
      "t1.titolo": "Four generations of smiths and locksmiths",
      "a.porta": "At the entrance: a bas-relief of a smith at work on his bench, and the iron door with its panels.",
      "k.porta": "At the entrance: the smith at work and the iron door",
      "t1.q1": "Early 1900s",
      "t1.t1": "«It was born as a firm of smiths in the early 1900s under the name CALURA ROMA, founded by Mrs “Gina” Roma.» Her sons, Mario and Nino, learn at the Parma factory «how safes and locks are made, installed and opened».",
      "t1.t2": "«In 1910 the two brothers found the FUSAGLIA firm […]. The FUSAGLIA brothers develop the firm as specialised smiths and locksmiths.»",
      "t1.q3": "Mario",
      "t1.t3": "He patents «many inventions, from shutters to folding beach loungers, from floor door-closers to Venetian blinds». Nino, «a great technician»; Mario, «a great smith and a great dancer».",
      "t1.q4": "After the war",
      "t1.t4": "«[…] for the rebuilding of Milan, he is commissioned a great many wrought-iron main doors and other ironwork.» And «they are the first to build iron armoured doors for flats and banks».",
      "t1.t5": "Luciano, Mario’s son, joins: for twenty years he builds armoured doors and installs locks «with the usual care and precision».",
      "t1.q6": "Late 1980s",
      "t1.t6": "Luca and Andrea, Luciano’s sons, join: «they specialise in installing and opening locks, earning several certificates from international schools in the field».",
      "t1.t7": "Fusaglia Mechatronic Systems is born, for electronic locks and access control.",
      "t1.q8": "Today",
      "t1.t8": "A historic shop of Milan (the City’s register, no. 92) and a «Storica attività» (historic business) for the Lombardy Region. «The story does not stop at the present day, because locks keep evolving and improving.»",
      "d.etichetta": "Reviews",
      "d.titolo": "Who comes to the shop",
      "d.voto": "on Google, 89 reviews",
      "d.t26": "Google, 2026",
      "d.t23": "Google, 2023",
      "d.t22": "Google, 2022",
      "d.nota": "From the reviews on Google, in Italian, as they were written. The line at the top comes from another customer, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Monday to Friday, morning and afternoon",
      "r.testa": "Hours",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "r.nota": "Hours from our Google listing (September 2026).",
      "w.mappa": "Map: Fusaglia, Via Zebedia 2 bis, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Zebedia 2 bis, 20123 Milan, a few steps from Piazza Missori and the Duomo",
      "w.metro": "By metro",
      "w.metrov": "M3 Missori, about 150 metres away; M1 and M3 Duomo, about 400",
      "w.tram": "By tram",
      "w.tramv": "the 15, 16 and 24 at Missori, about 100 metres away; the 3 on Via Torino, about 170",
      "w.tel": "Phone",
      "w.mail": "Email",
      "f2.riga": "Keys • locks • safes · since 1910 · Historic shop of Milan",
      "f2.orario": "Monday to Friday 8:30 am–12:30 pm and 2:30–7 pm · closed Saturday and Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from the Google listing (September 2026); the photos from the Google listing (theirs and the virtual tour of the shop); the history and their words from their old website. We drew the safe ourselves, from the tower of safes in the shop.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FUSAGLIA — Via Zebedia 2 bis ══════════
     la FIRMA — «la cassaforte»: una cassaforte bordeaux e crema come quelle della torre in bottega. Si apre in tre modi: la
     combinazione (la manopola a destra fino al 19, a sinistra fino al 10), la chiave a doppia mappa (due mandate), il codice 1910 sul
     tastierino (la spia verde); poi il pomolo gira e lo sportello si spalanca sull'interno rosso, col meccanismo sul retro. Lo stato è
     M (il modo), T (0…1) e V (0 al suo posto; fino a 1 la cassaforte esce a destra; da −1 a 0 entra da sinistra la prossima, chiusa).
     Senza JS e alla fine: Combinazione, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la cassaforte chiusa.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":560,"fasi":{"destra":{"t":0.04,"d":0.24},"sinistra":{"t":0.31,"d":0.21},"arriva":{"t":0.04,"d":0.1},"mandate":[{"t":0.17,"d":0.15},{"t":0.37,"d":0.15}],"tasti":{"t":0.06,"d":0.38},"spia":{"t":0.47,"d":0.05},"maniglia":{"t":0.55,"d":0.09},"sportello":{"t":0.66,"d":0.34}},"durate":{"tasto":0.07},"giri":{"destra":651.6,"sinistra":327.6},"codice":["1","9","1","0"],"colori":{"tasto":[243,238,226],"premuto":[224,180,76],"rossa":[200,55,45],"verde":[46,173,91]},"porta":{"x":288,"l":220,"s":24},"serratura":[370,300],"pomolo":[466,300],"combinazione":[19,10],"modi":[{"nome":"Combinazione"},{"nome":"Chiave"},{"nome":"Elettronica"}],"tempi":{"inizio":300,"cassaforte":7800,"servi":480,"arriva":520,"cassaforteV":7000}};
  /* la cassaforte a (M, T, V) — una sola fonte: la usano _fus_firma.mjs (l'HTML allo stato finale), main.js (via fus_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Una cassaforte bordeaux e crema come quelle della torre in bottega. Si apre in tre modi: la combinazione (la manopola a destra
     fino al 19, a sinistra fino al 10: 1910), la chiave a doppia mappa (arriva e fa due mandate), il codice 1-9-1-0 sul tastierino (la
     spia diventa verde). Poi il pomolo a tre razze gira e lo sportello si spalanca di 180° sui cardini a sinistra: prima la faccia
     crema si stringe, poi si vede la costa coi catenacci, poi il retro col meccanismo del modo. Col V la cassaforte esce a destra; la
     prossima, chiusa, entra da sinistra. */
  function creaCassaforte(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    /* un colore fra due (rgb, canale per canale) */
    var mescola = function (a, b, u) { return 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * u); }).join(',') + ')'; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), anta = q1('cf-anta'), antaOmbra = q1('cf-anta-ombra'), taglio = q1('cf-taglio'), retro = q1('cf-retro'), retroOmbra = q1('cf-retro-ombra');
    var pomolo = q1('cf-pomolo'), ghiera = q1('cf-ghiera'), chiave = q1('cf-chiave'), spia = q1('cf-spia');
    /* i tasti del codice (una volta per cifra: l'1 si preme due volte) */
    var cifre = D.codice.filter(function (k, i) { return D.codice.indexOf(k) === i; });
    var tasti = cifre.map(function (k) { return svg.querySelector('.cf-tasto[data-k="' + k + '"]'); });
    var S = D.porta, L = D.serratura, P = D.pomolo;
    /* la finestra dell'i-esimo di n elementi in fila dentro una fase, ognuno lungo d */
    var inFila = function (F, i, n, d) { return { t: F.t + (n > 1 ? i * (F.d - d) / (n - 1) : 0), d: d }; };
    function disegna(m, t, v) {
      var F = D.fasi, G = D.giri;
      /* 1. la serratura del modo */
      if (m === 0) {
        /* la combinazione: a destra (orario) fino al 19 con un giro in più, poi a sinistra fino al 10 */
        var gira = G.destra * dolce(fase(t, F.destra)) - G.sinistra * dolce(fase(t, F.sinistra));
        ghiera.setAttribute('transform', 'rotate(' + r1(gira) + ' ' + L[0] + ' ' + L[1] + ')');
      } else if (m === 1) {
        /* la chiave arriva (da più vicino: grande e trasparente) e fa due mandate */
        var a = dolce(fase(t, F.arriva));
        var giro = 360 * dolce(fase(t, F.mandate[0])) + 360 * dolce(fase(t, F.mandate[1]));
        chiave.setAttribute('transform', 'translate(' + L[0] + ' ' + L[1] + ') rotate(' + r1(giro) + ') scale(' + r3(1.35 - 0.35 * a) + ')');
        chiave.setAttribute('opacity', String(r3(a)));
      } else {
        /* il codice: ogni tasto si accende d'oro e si spegne; alla fine la spia verde */
        tasti.forEach(function (el, j) {
          var su = 0;
          D.codice.forEach(function (k, i) { if (k === cifre[j]) su = Math.max(su, Math.sin(Math.PI * fase(t, inFila(F.tasti, i, D.codice.length, D.durate.tasto)))); });
          el.setAttribute('fill', mescola(D.colori.tasto, D.colori.premuto, r3(su)));
        });
        spia.setAttribute('fill', mescola(D.colori.rossa, D.colori.verde, r3(dolce(fase(t, F.spia)))));
      }
      /* 2. il pomolo a tre razze gira di un quarto */
      pomolo.setAttribute('transform', 'rotate(' + r1(90 * dolce(fase(t, F.maniglia))) + ' ' + P[0] + ' ' + P[1] + ')');
      /* 3. lo sportello si spalanca sui cardini a sinistra (proiezione dritta): la faccia crema si stringe verso i cardini, la costa
            si allarga, poi il retro (specchiato) si apre a sinistra */
      var phi = Math.PI * dolce(fase(t, F.sportello)), c = Math.cos(phi), s = Math.sin(phi);
      anta.setAttribute('transform', 'matrix(' + r3(c) + ' 0 0 1 ' + r1(S.x * (1 - c)) + ' 0)');
      anta.setAttribute('opacity', c > 1e-9 ? '1' : '0');
      antaOmbra.setAttribute('opacity', String(r3(0.3 * (1 - c))));
      taglio.setAttribute('transform', 'matrix(' + r3(s) + ' 0 0 1 ' + r1(S.x + S.l * c) + ' 0)');
      retro.setAttribute('transform', 'matrix(' + r3(c) + ' 0 0 1 ' + r1(S.x + S.s * s - S.x * c) + ' 0)');
      retro.setAttribute('opacity', c < -1e-9 ? '1' : '0');
      retroOmbra.setAttribute('opacity', String(r3(0.3 * (1 + c))));
      /* col V la cassaforte esce a destra; la prossima entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && anta && antaOmbra && taglio && retro && retroOmbra && pomolo && ghiera && chiave && spia) && tasti.every(Boolean);
    return { disegna: disegna, pezzi: { tasti: tasti }, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('cassaforte-firma'), svgF = prendi('cassaforteSvg'), leggiF = prendi('cassaforteLeggi');
  var CASSAFORTE = svgF ? creaCassaforte(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.cassaforte__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.cassaforte__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    CASSAFORTE.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) CASSAFORTE.disegna(k, 1, 0); });
    CASSAFORTE.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la cassaforte chiusa */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la cassaforte chiusa */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.cassaforte, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.cassaforte });
  }
  /* il gesto: scegliere come si apre. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la cassaforte esce a destra, entra da sinistra la prossima chiusa, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.cassaforteV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && CASSAFORTE && CASSAFORTE.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaCassaforte); } catch (e) {}
    window.__cassaforte = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__cassaforte.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la cassaforte chiusa */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__cassaforte.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
