const CACHE_NAME = 'hymnary-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192x192.png', // Exemplo de ícone, ajuste o nome conforme seu arquivo real
    'https://cdn.tailwindcss.com', // Tailwind CSS para funcionar offline
];

self.addEventListener('install', event => {
    // Garante que o Service Worker não será instalado até que todos os arquivos estejam em cache
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                // Adiciona todos os recursos necessários ao cache
                return cache.addAll(urlsToCache);
            })
            // Adiciona uma chamada para forçar o novo SW a se tornar ativo imediatamente
            .then(() => self.skipWaiting()) 
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache, se encontrado
                if (response) {
                    return response;
                }
                // Se não estiver no cache, faz a requisição normal
                return fetch(event.request);
            })
    );
});

// Este bloco ajuda a garantir que os usuários sempre vejam a versão mais recente
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        // Remove caches antigos que não estão na lista branca (ex: 'hymnary-cache-v0')
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
    // Força o Service Worker ativo a assumir o controle dos clientes imediatamente
    return self.clients.claim();
});