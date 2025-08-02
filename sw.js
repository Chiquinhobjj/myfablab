// Service Worker para Cache e Performance
const CACHE_NAME = 'chat-ai-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Arquivos essenciais para cache
const STATIC_FILES = [
    '/',
    '/index-optimized.html',
    '/style.css',
    '/app-optimized.js',
    'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2'
];

// Estratégia de cache
const CACHE_STRATEGIES = {
    static: {
        cacheName: STATIC_CACHE,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    },
    dynamic: {
        cacheName: DYNAMIC_CACHE,
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
        maxItems: 50
    }
};

// Install - Cache arquivos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - Limpar caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => {
                        return cacheName !== STATIC_CACHE && 
                               cacheName !== DYNAMIC_CACHE;
                    })
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Estratégias de cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip OpenRouter API calls
    if (url.hostname === 'openrouter.ai') return;
    
    // Static files - Cache First
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // HTML files - Network First
    if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Default - Cache First with Network Fallback
    event.respondWith(cacheFirst(request));
});

// Helper: Check if URL is a static asset
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Strategy: Cache First
async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
        // Update cache in background
        fetchAndCache(request, STATIC_CACHE);
        return cached;
    }
    
    return fetchAndCache(request, STATIC_CACHE);
}

// Strategy: Network First
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Return offline page if available
        return caches.match('/offline.html') || new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// Helper: Fetch and cache
async function fetchAndCache(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok && response.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}

// Message handling for cache control
self.addEventListener('message', event => {
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                return self.clients.matchAll();
            }).then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CACHE_CLEARED',
                        message: 'All caches cleared successfully'
                    });
                });
            })
        );
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then(cache => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

// Background sync for offline messages
self.addEventListener('sync', event => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

async function syncMessages() {
    // Get pending messages from IndexedDB
    // Send them when online
    // This would require IndexedDB implementation
    console.log('Syncing offline messages...');
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nova mensagem no Chat AI',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Chat AI', options)
    );
});