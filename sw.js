// Appli disponible hors connexion ; promos.json toujours récupéré en ligne en priorité.
const C = "promos-v1";
const SHELL = ["./", "index.html", "manifest.json", "icon.svg", "promos.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // réseau d'abord (données fraîches), cache en secours
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request.url.split("?")[0], cp)); return r; })
    .catch(() => caches.match(e.request.url.split("?")[0])));
});
