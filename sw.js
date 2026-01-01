// XSSNow Service Worker - PWA Functionality
const CACHE_NAME = 'xssnow-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/payloads.html',
    '/xss-payload-generator.html',
    '/contributors.html',
    '/docs.html',
    '/404.html',
    '/manifest.json',
    '/css/styles.css',
    '/css/animations.css',
    '/css/components.css',
    '/js/app.js',
    '/js/animations.js',
    '/assets/ninja.svg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('XSSNow SW: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('XSSNow SW: Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('XSSNow SW: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip external domains
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content with shorter TTL
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Fallback to 404 page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/404.html');
                        }
                    });
            })
    );
});

// Background sync for offline payload submissions (future feature)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('XSSNow SW: Background sync triggered');
        // Future: Handle offline payload submissions
    }
});

// Push notifications (future feature for new payloads)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('XSSNow SW: Push received', data);

        const options = {
            body: data.body || 'New XSS payloads available!',
            icon: '/assets/ninja.svg',
            badge: '/assets/ninja.svg',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'XSSNow', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});