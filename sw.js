/* Bússola da Esquerda — service worker. Cache-first p/ shell estático; network-first p/ /api/card. */
var CACHE = 'bussola-v1';
var SHELL = ['/', '/index.html', '/privacidade', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/api/') === 0) {
    e.respondWith(fetch(e.request).catch(function () { return caches.match('/'); }));
    return;
  }
  /* Shell: /en e /es são rewrites da home — normaliza para '/' no cache */
  var shellPaths = ['/', '/index.html', '/en', '/es'];
  var key = shellPaths.indexOf(url.pathname) >= 0 ? '/' : e.request;
  e.respondWith(
    caches.match(key).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(key === '/' ? '/' : e.request, copy); });
        return res;
      }).catch(function () { return caches.match('/'); });
    })
  );
});
