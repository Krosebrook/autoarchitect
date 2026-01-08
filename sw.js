
const CACHE_NAME = 'autoarchitect-v2.6.9-production';
const API_HOSTNAME = 'googleapis.com';

const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

/**
 * Stale-While-Revalidate Implementation
 * Returns cached version immediately, while silently updating the cache via the network.
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const networkFetch = fetch(request).then((networkResponse) => {
    // Only cache successful GET requests
    if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || networkFetch;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }

  // 1. AI Synthesis Services: Return JSON offline signal if network fails
  if (url.hostname.includes(API_HOSTNAME)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ 
            status: "offline", 
            message: "AI Synthesis Engine is currently disconnected. Please re-establish network connection to generate new blueprints.",
            code: "SYNC_OFFLINE_ERR"
          }), 
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // 2. Navigation events: Fallback to index.html for SPA routing support
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('index.html') || caches.match('./'))
    );
    return;
  }

  // 3. Application Assets & External Libraries: Stale-While-Revalidate
  const isApplicationAsset = 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css') || 
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('esm.sh') || // Cache dynamic ESM modules
    url.pathname.includes('icons');

  if (isApplicationAsset || request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default behavior: Network preferred, cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
