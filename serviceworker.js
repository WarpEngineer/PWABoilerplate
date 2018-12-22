// PWABoilerplate service worker file

var cacheName    = 'pwaboilerplate_v1'; // name of cache to use
var oldCacheName = 'pwaboilerplate_v0'; // name of cache from previous version of app. used to remove old cache.

// attach listener to 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', function(event) {
	// NOTE: use the following 2 lines to cancel the Add to Home Screen prompt altogether
	/*event.preventDefault();
	return false;*/
	event.userChoice.then(
		function(result) {
			console.log(result.outcome);
			if(result.outcome == 'dismissed') { /* prompt was dismissed */ }
			else { /* prompt was accepted */ }
		}
	);
});

// attach listener to 'install' event
self.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting()); // trigger activate event to start immediately instead of waiting for a page reload
	event.waitUntil(
		caches.open(cacheName).then(
			cache => cache.addAll([ '/index.html', '/index.js'])
		)
	);
});

// attach listener to 'activate' event
self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim()); // claim all current clients to activate immediately instead of waiting for a page reload
});

// attach listener to 'fetch' event
self.addEventListener('fetch', function(event) { 
	event.respondWith(
		// first, check if the requested document is in the cache
		caches.match(event.request /* , { ignoreSearch: true } */).then( // ignoreSearch: set to true to ignore querystring
			function(response) {
				// if found in the cache, return it, else fetch from server
				if(response) return response;
				var requestToCache = event.request.clone() 
				return fetch(requestToCache).then(
					function(response) {
						if(!response || response.status !== 200) return reponse;
						var responseToCache = response.clone();
						// cache the fetched result
						caches.open(cacheName).then(
							function(cache) {
								cache.put(requestToCache, responseToCache);
							}
						);
						return response;
					}
				);
			}
		)
	);
});

// bookmark:L7.3
//


