// HomePlanner Service Worker — minimal PWA shell
// No aggressive caching: the app is always-online (Supabase realtime)
const CACHE_NAME = 'homeplanner-v1';

// Cache only the app shell on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        '/home-planner/',
        '/home-planner/index.html',
      ]).catch(() => {
        // Silently fail — app works without cache
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Network-first: always try network, fall back to cache for navigation only
self.addEventListener('fetch', event => {
  // Only handle GET navigation requests (HTML page loads)
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);

  // For navigation requests, serve index.html from cache if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/home-planner/index.html')
      )
    );
    return;
  }

  // All other requests: network only (don't cache Supabase API calls etc.)
  // Just let them pass through naturally
});
