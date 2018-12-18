// PWABoilerplate service worker file

var cacheName    = 'pwaboilerplate_v1'; // name of cache to use
var oldCacheName = 'pwaboilerplate_v0'; // name of cache from previous version of app. used to remove old cache.

// attach listener to 'install' event
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(
			cache => cache.addAll([ '/index.html', '/index.js'])
		)
	);
});

// attach listener to 'fetch' event
self.addEventListener('fetch', function(event) { 
	event.respondWith(
		// first, check if the requested document is in the cache
		caches.match(event.request).then(
			function(response) {
				// if found in the cache, return it, else fetch from server
				if(response) return response;
				return fetch(event.request);
			}
		)
	);
});

// bookmark:L3.5
