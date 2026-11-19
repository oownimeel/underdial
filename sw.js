// Offline cache: the app is a handful of static files, so all of them are cached
// at install and served cache-first. Bump VERSION whenever any file changes.
const VERSION = "underdial-v2";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "js/app.js",
  "js/engine.js",
  "js/analysis-worker.js",
  "js/audio.js",
  "js/store.js",
  "js/i18n.js",
  "js/i18n-en.js",
  "js/ui.js",
  "js/dial.js",
  "js/card.js",
  "js/views/home.js",
  "js/views/measure.js",
  "js/views/records.js",
  "js/views/watch.js",
  "js/views/settings.js",
  "js/views/onboarding.js",
  "fonts/Pretendard-Regular.woff2",
  "fonts/Pretendard-Medium.woff2",
  "fonts/Pretendard-SemiBold.woff2",
  "fonts/Inter-Light.woff2",
  "fonts/Inter-Medium.woff2",
  "fonts/PlayfairDisplay.woff2",
  "fonts/GreatVibes.woff2",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-192.png",
  "icons/maskable-512.png",
  "icons/favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request)),
  );
});
