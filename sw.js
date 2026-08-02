/* Service worker — tableau de bord enseignant.
   Stratégie RÉSEAU D'ABORD : en ligne, on sert toujours la version fraîche et on met
   le cache à jour ; hors ligne seulement, on se rabat sur le cache. Une mise à jour
   déployée arrive donc tout de suite — jamais de version périmée servie aux enseignants.
   On ne touche qu'aux fichiers du site : Supabase et le CDN passent sans interception. */

const CACHE = "quest-enseignant-v5";
const ASSETS = ["index.html", "app.js", "style.css", "icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // laisse passer Supabase, le CDN, l'auth
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(e.request).then((hit) => hit || caches.match("index.html"))
    )
  );
});
