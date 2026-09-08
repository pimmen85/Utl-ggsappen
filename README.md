# Utläggsappen

Webbapp (PWA) för utläggsredovisning: fota eller ladda upp kvitton, låt appen läsa av
datum, belopp, moms, kostnad utan moms och beskrivning, granska raderna och skapa en
samlad PDF som kan skickas för attest och vidare till löneavdelningen. Dessutom kan en
ifylld kopia av Excel-mallen laddas ner.

PDF:en görs på A3 för läslighetens skull. Med högst två bilagor ligger blanketten och
kvittona på samma sida; med fler får blanketten en egen sida i stor skala och kvittona
egna sidor. Skanningar med flera kvitton bredvid varandra delas upp automatiskt så att
varje kvitto beskärs och visas för sig, med sitt bilaganummer i en blå ring.

Allt är statiska filer – ingen server eller byggsteg behövs. Appen fungerar på mobil,
surfplatta och dator och kan läggas till på hemskärmen.

## Använda appen

1. **Ny rapport** – namnge månaden, fyll i namn/anställningsnummer (kommer ihåg sig).
2. **Fota kvitto** eller **Välj bild/PDF** – varje kvitto blir en rad. Totalbelopp, moms,
   kostnaden utan moms, datum och beskrivning fylls i automatiskt; gulmarkerade rader bör
   kontrolleras.
3. Rätta vid behov, lägg till projekt/kst/konto.
4. **Skapa PDF** – förhandsgranska, spara eller dela. **Ladda ner Excel** ger mallen ifylld.
5. Under ⚙ kan du rita din **signatur** (ritas in i Sign-fältet), ange standardvärden och
   slå på synk mellan enheter.

Rapporter och kvitton sparas lokalt i webbläsaren (IndexedDB). Inget skickas någonstans,
förutom till Anthropic om du valt AI-läsning och till din egen Google Drive om du slagit
på synk.

## Belopp med och utan moms

Varje rad har **Totalbelopp**, **Varav moms** och **Utan moms**. Nettot läses direkt från
kvittots momsspecifikation när en sådan finns (t.ex. `MOMS% BRUTTO MOMS NETTO`), annars
räknas det fram som totalbelopp minus moms. Fyller du i två av de tre fälten räknas det
tredje ut automatiskt.

Går de tre beloppen inte ihop markeras raden rött, eftersom det oftast betyder att något
lästes av fel. Skillnader på öresnivå mellan momsspecifikationen och beloppet som faktiskt
drogs (öresavrundning) räknas inte som fel. Appen gissar aldrig en momssats: står momsen
inte på kvittot lämnas både moms och netto tomma.

Blanketten har ingen nettokolumn, så fältet finns bara i appen – Excel-filen och PDF:en är
oförändrade mot mallen.

## Synk mellan enheter

Under ⚙ → **Synk mellan enheter** kan rapporterna läggas i mappen `Utläggsappen` på din
egen Google Drive, en JSON-fil per rapport, så att en rapport du börjar på i mobilen finns
på datorn. **Kvittobilderna synkas inte** – de ligger kvar på enheten där de lades till,
och appen varnar innan du skapar en PDF på en enhet där bilagorna saknas. API-nyckeln och
signaturen synkas aldrig.

Du behöver skapa ett eget OAuth-klient-ID en gång (stegen finns i appen under ⚙):
projekt i Google Cloud Console → aktivera **Google Drive API** → OAuth-samtyckesskärm med
dig själv som testanvändare → behörigheten `drive.file` → klient-ID av typen
**Web application** med `https://pimmen85.github.io` och `http://localhost:8099` som
tillåtna JavaScript-origins. Klistra sedan in klient-ID:t i appen på varje enhet och
anslut med samma Google-konto.

Utan Drive går det också att flytta en rapport med **Exportera rapport** och
**Importera rapport** (en JSON-fil du skickar till dig själv).

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

Repot ligger på GitHub: https://github.com/pimmen85/Utl-ggsappen. Workflowet
`.github/workflows/pages.yml` publicerar appen automatiskt vid varje push till `main`
(körningen "Deploy to GitHub Pages" syns under fliken Actions). Appen nås på
`https://pimmen85.github.io/Utl-ggsappen/`. Lägg till den på hemskärmen i mobilen
(Dela → Lägg till på hemskärmen).

Höj `APP_VERSION` i `index.html` och `CACHE` i `sw.js` vid varje publicerad ändring.

## Köra lokalt

```
python3 -m http.server 8099
```

Öppna sedan `http://localhost:8099/`.
