# Breathune web — nasadenie na GitHub Pages

Tento priečinok je **jediný zdroj** webu `https://dzanino.github.io/Breathune/`.
Staršie kópie v `Breathune Full/web/` a `Breathune_Android/web/` už nepoužívaj — rozišli sa.

## Čo sa nahráva

```
index.html                 ← nová úvodná stránka (SK/EN)
style.css                  ← spoločný štýl (nové pravidlá sú zúžené na body.home)
lang.js                    ← prepínač jazyka (nezmenený)
privacy-policy/index.html  ← NEZMENENÝ – URL zadaná v App Store Connect aj Play Console
support/index.html         ← NEZMENENÝ – URL zadaná v App Store Connect
assets/                    ← ikona, favicon, 4 screenshoty (~600 kB spolu)
.nojekyll                  ← GitHub Pages neprejde obsah cez Jekyll
```

`NASADENIE.md` sa nahrať nemusí (neškodí, ak sa nahrá).

## Adresy, ktoré musia ostať platné

| Kde je zadaná | URL |
|---|---|
| App Store Connect — Privacy Policy URL, Play Console — zásady | `https://dzanino.github.io/Breathune/privacy-policy/` |
| App Store Connect — Support URL | `https://dzanino.github.io/Breathune/support/` |
| App Store Connect — Marketing URL | `https://dzanino.github.io/Breathune/` |

Cesty `privacy-policy/` a `support/` sú zachované bajt po bajte oproti dnešnej živej verzii.

## Postup

1. Otvor repozitár **dzanino/Breathune** na GitHube.
2. Nahraj obsah tohto priečinka do koreňa repozitára (Add file → Upload files, alebo cez git).
   Prepíšu sa `index.html`, `style.css`, `lang.js`; pribudne `assets/` a `.nojekyll`.
3. Počkaj ~1–2 minúty a skontroluj `https://dzanino.github.io/Breathune/`.
   Ak vidíš starú verziu, obnov stránku so Shift (cache).

## Keď bude Android v Google Play

V `index.html` sú dve tlačidlá Google Play označené ako „čoskoro". Pri každom:

1. zmeň `<span class="store soon" aria-disabled="true" data-href="…">` na `<a class="store" href="…" target="_blank" rel="noopener">` (a zatváracie `</span>` na `</a>`),
2. text `Google Play — čoskoro` / `coming soon` nahraď `Stiahnuť v Google Play` / `Get it on Google Play`.

Odkazy sú už pripravené v `data-href`:
- Full: `https://play.google.com/store/apps/details?id=sk.sikuta.breathune`
- Lite: `https://play.google.com/store/apps/details?id=sk.sikuta.breathune.lite`

## Odkazy na App Store (overené cez iTunes API)

- Breathune (Full): `https://apps.apple.com/app/breathune/id6782549502`
- Lite Breathune: `https://apps.apple.com/app/lite-breathune/id6786838686`

Bez kódu krajiny v URL — App Store sám presmeruje na obchod používateľa.
