self.addEventListener('install', (event)=>{
    console.log("[Service Worker] Installing Service Worker...", event);
    event.waitUntil(
        caches.open('spotifire-tokyo-static').then(function(cache) {
            return cache.addAll([
                '/static/css/common.css',
                '/static/css/muse-ui.css',
                '/static/css/normalize.min.css',
                '/static/css/semantic.min.css'
            ]);
        })
    );
})


self.addEventListener('activate', (event)=>{
    console.log("[Service Worker] Activating Service Worker...", event);
    return self.clients.claim();
})


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
    );
});
