const CACHE_NAME = 'hymnary-cache-v1';

// --- CORREÇÃO PWA GITHUB PAGES: Defina o caminho base do seu projeto ---
// Seu projeto está na subpasta 'hbj'.
const BASE_PATH = '/hbj/';

const urlsToCache = [
    BASE_PATH, // Garante que a raiz do projeto (index.html) seja cacheadas corretamente
    BASE_PATH + 'index.html',
    BASE_PATH + 'manifest.json',
    BASE_PATH + 'icon-192.png',
    BASE_PATH + 'icon-512.png',
    'https://cdn.tailwindcss.com', 
];

self.addEventListener('install', event => {
    // ... (o restante do código de instalação e cache continua o mesmo)
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) 
    );
});

self.addEventListener('fetch', event => {
    // ... (o restante do código de fetch continua o mesmo)
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    // ... (o restante do código de activate continua o mesmo)
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

