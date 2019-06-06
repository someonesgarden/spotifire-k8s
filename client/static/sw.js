self.addEventListener('install', (event)=>{
    console.log("[Service Worker] Installing Service Worker...", event);
})

self.addEventListener('activate', (event)=>{
    console.log("[Service Worker] Activating Service Worker...", event);
    return self.clients.claim();
})

self.addEventListener('fetch', (event)=>{
    console.log("[Service Worker] Fecthing Something...",event);
})
// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open('first-app')
//       .then(function(cache) {
//         cache.addAll([
//           '/',
//           '/index.html',
//           '/src/css/app.css',
//           '/src/js/app.js'
//         ])
//       })
//   );
//   return self.clients.claim();
// });
//
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(res) {
//         return res;
//       })
//   );
// });
