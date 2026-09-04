// Service worker för Utläggsappen.
// CACHE höjs i takt med APP_VERSION i index.html så att gamla filer rensas
// när en ny version publiceras.
const CACHE = 'utlaggsappen-v1.0';

// Filer som hämtas direkt vid installation så att appen fungerar offline.
// OCR-filerna (vendor/tesseract/*) är stora och cachas först när de används,
// eller via knappen "Hämta offline-OCR" i inställningarna.
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './assets/logo.png',
  './assets/mall.xlsx',
  './vendor/pdf-lib.min.js',
  './vendor/fflate.js',
  './vendor/pdfjs/pdf.min.mjs',
  './vendor/pdfjs/pdf.worker.min.mjs',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Anrop till andra domäner (t.ex. Claude-API:et) går alltid direkt till nätet.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    // Network-first för själva appen så att uppdateringar når enheten direkt.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first för bibliotek, mall, logga och OCR-filer; uppdateras i bakgrunden.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
      return cached || network;
    })
  );
});
