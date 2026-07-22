/* Spelmodellen.se — minimal service worker.
 *
 * Strategi:
 *   - Navigation (HTML): network-first med 4s timeout → fallback cache.
 *     Vi vill alltid ha nytt innehåll om vi har nät, men gärna något om vi inte har.
 *   - Statiska assets (script/style/font/img): cache-first med background-refresh.
 *   - API/Supabase: by-pass (vi lämnar dessa till nätverk + TanStack Query).
 *
 * Versionera cachenamnet när formatet ändras så aktiva SWs städas.
 */
const CACHE_VERSION = "v4";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isApiRequest(url) {
  if (url.origin.endsWith(".supabase.co")) return true;
  if (url.pathname.startsWith("/api/")) return true;
  return false;
}

function networkFirst(request, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(async () => {
      const cached = await caches.match(request);
      if (cached) resolve(cached);
    }, timeoutMs);

    fetch(request)
      .then(async (response) => {
        clearTimeout(timeoutId);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone()).catch(() => undefined);
        resolve(response);
      })
      .catch(async () => {
        clearTimeout(timeoutId);
        const cached = await caches.match(request);
        resolve(cached || Response.error());
      });
  });
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then((response) => {
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response));
      })
      .catch(() => undefined);
    return cached;
  }
  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone()).catch(() => undefined);
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (isApiRequest(url)) return; // pass-through till nätverk

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (["script", "style"].includes(request.destination)) {
    event.respondWith(networkFirst(request, 1500));
    return;
  }

  if (["font", "image"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
  }
});
