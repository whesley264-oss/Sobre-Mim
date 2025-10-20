// Service Worker básico para funcionalidade PWA (offline)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('portfolio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/translations.js',
        '/manifest.json'
        // Adicione outros recursos estáticos aqui se necessário
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
