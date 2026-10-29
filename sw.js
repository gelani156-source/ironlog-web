const CACHE_NAME = "ironlog-v7-cache";
const ASSETS = [
  "./index.html",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// Установка сервис-воркера и кэширование файлов
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и очистка старых кэшей
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват сетевых запросов (работа оффлайн)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Если нет сети и файла в кэше — можно вернуть заглушку
      });
    })
  );
});
