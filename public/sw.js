const CACHE_NAME = "iatech-shell-v1";
const SHELL = ["/offline", "/icon.svg"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") { event.respondWith(fetch(request).catch(() => caches.match("/offline"))); return; }
  if (url.pathname.startsWith("/_next/static/") || url.pathname === "/icon.svg") event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; })));
});
self.addEventListener("message", (event) => { if (event.data?.type === "CLEAR_USER_CACHES") event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))); });
