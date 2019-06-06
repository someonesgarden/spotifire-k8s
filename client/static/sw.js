self.addEventListener('install', (event)=>{
    console.log("[Service Worker] Installing Service Worker...", event);
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/static/',
                '/static/css/common.css'
            ]);
        })
    );
})

// self.addEventListener('install', function(event) {
//     console.log("[Service Worker] Installing Service Worker...", event);
//     event.waitUntil(
//         caches.open('first-app')
//             .then(function(cache) {
//                 cache.addAll([
//                     '/static/css/common.css'
//                 ])
//             })
//     );
//     return self.clients.claim();
// });


self.addEventListener('activate', (event)=>{
    console.log("[Service Worker] Activating Service Worker...", event);
    return self.clients.claim();
})



self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        return res;
      })
  );
});
