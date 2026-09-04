# Utläggsappen

Webbapp (PWA) för utläggsredovisning: fota eller ladda upp kvitton, låt appen läsa av
datum, belopp, moms och beskrivning, granska raderna och skapa en samlad PDF – bilagorna
överst och den ifyllda utläggsredovisningen nederst på en A3-sida – som kan skickas för
attest och vidare till löneavdelningen. Dessutom kan en ifylld kopia av Excel-mallen
laddas ner.

Allt är statiska filer – ingen server eller byggsteg behövs. Appen fungerar på mobil,
surfplatta och dator och kan läggas till på hemskärmen.

## Använda appen

1. **Ny rapport** – namnge månaden, fyll i namn/anställningsnummer (kommer ihåg sig).
2. **Fota kvitto** eller **Välj bild/PDF** – varje kvitto blir en rad. Belopp, moms, datum
   och beskrivning fylls i automatiskt; gulmarkerade rader bör kontrolleras.
3. Rätta vid behov, lägg till projekt/kst/konto.
4. **Skapa PDF** – förhandsgranska, spara eller dela. **Ladda ner Excel** ger mallen ifylld.
5. Under ⚙ kan du rita din **signatur** (ritas in i Sign-fältet) och ange standardvärden.

Rapporter och kvitton sparas lokalt i webbläsaren (IndexedDB). Inget skickas någonstans,
förutom till Anthropic om du valt AI-läsning.

## Kvittoläsning

* **AI (rekommenderas):** lägg in en API-nyckel från [Anthropic](https://console.anthropic.com/)
  under ⚙. Kvitton läses av med Claude (foton, skanningar och PDF:er) och får en
  beskrivning i blankettens stil. Nyckeln sparas bara i webbläsaren. Kostar några öre per kvitto.
* **Lokal OCR:** utan nyckel läses digitala PDF:er via textlagret och foton/skanningar med
  Tesseract.js (svenska) direkt i webbläsaren. Belopp och moms hittas med regler
  (t.ex. "Totalt", "Moms", momssats 25/12/6 %). Träffsäkerheten är lägre på mobilfoton.
  OCR-filerna (ca 7 MB) hämtas första gången eller via "Hämta offline-OCR".

## Filer

```
index.html            hela appen (HTML + CSS + JS)
manifest.json, sw.js  PWA (installerbar, offline)
icon.svg, icon-*.png  appikon
assets/mall.xlsx      Excel-mallen (används oförändrad vid Excel-export)
assets/logo.png       loggan i sidhuvudet
vendor/               pdf-lib, pdf.js, fflate, Tesseract.js (+ svensk språkfil)
```

## Publicera (GitHub Pages)

Repot ligger på GitHub: https://github.com/pimmen85/Utl-ggsappen. Under
**Settings → Pages** välj *Deploy from a branch*, branch `main`, mapp `/ (root)`.
Appen nås sedan på `https://pimmen85.github.io/Utl-ggsappen/`. Lägg till den på
hemskärmen i mobilen (Dela → Lägg till på hemskärmen).

Höj `APP_VERSION` i `index.html` och `CACHE` i `sw.js` vid varje publicerad ändring.

## Köra lokalt

```
python3 -m http.server 8099
```

Öppna sedan `http://localhost:8099/`.
