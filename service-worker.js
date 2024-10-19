const CACHE_NAME = 'credit-calculator-cache-v10';// Измените версию кэша при каждом обновлении
const urlsToCache = [
  '/',
  '/credit-calculator/index.html',
  '/credit-calculator/manifest.json',
  '/credit-calculator/icons/icon-192x192.png',
  '/credit-calculator/icons/icon-512x512.png'
];

// Установка Service Worker и кэширование необходимых файлов
self.addEventListener('install', function(event) {
  // Пропускаем стадию ожидания(когда старый Service Worker ещё активен) и сразу активируем новый Service Worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {      
      console.log('Opened cache:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

// Активация Service Worker
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Удаление старого кэша
            console.log('Delete old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  //Принудительная активация нового Service Worker к текущим клиентам
  return self.clients.claim();

});

// Перехват запросов и кэширование
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Возвращаем ресурс из кэша, если он там есть
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
