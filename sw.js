const CACHE_NAME = "ironlog-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return (
        res ||
        fetch(e.request).catch(() => {
          if (e.request.destination === "document") {
            return caches.match("./index.html");
          }
        })
      );
    })
  );
});
