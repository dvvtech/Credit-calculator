const CACHE_NAME = 'credit-calculator-cache-v10';// �������� ������ ���� ��� ������ ����������
const urlsToCache = [
  '/',
  '/credit-calculator/index.html',
  '/credit-calculator/manifest.json',
  '/credit-calculator/icons/icon-192x192.png',
  '/credit-calculator/icons/icon-512x512.png'
];

// ��������� Service Worker � ����������� ����������� ������
self.addEventListener('install', function(event) {
  // ���������� ������ ��������(����� ������ Service Worker ��� �������) � ����� ���������� ����� Service Worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {      
      console.log('Opened cache:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

// ��������� Service Worker
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // �������� ������� ����
            console.log('Delete old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  //�������������� ��������� ������ Service Worker � ������� ��������
  return self.clients.claim();

});

// �������� �������� � �����������
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // ���������� ������ �� ����, ���� �� ��� ����
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
