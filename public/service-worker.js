/* eslint-env serviceworker */
// TODO move this file to ../src/ and update browserify to put this in place

// TODO automate versioning
var version = 1
var cacheItems = [
  '/',
  '/index.html',
  // '/?homescreen=1',
  // '/index.html?homescreen=1',
  '/tufte.css',
  '/bundle.js',
  '/manifest.json',
  '/images/pi.jpg',
  '/images/1-counter.jpg',
  '/images/icon-144x144.png',
  '/images/icon-192x192.png',
  '/images/icon-256x256.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',
  '/images/touch-icon-ipad-retina.png',
  '/images/touch-icon-ipad.png',
  '/images/touch-icon-iphone-retina.png',
  '/images/touch-icon-iphone.png',
  '/et-book/et-book-roman-line-figures/et-book-roman-line-figures.woff',
  '/et-book/et-book-display-italic-old-style-figures/et-book-display-italic-old-style-figures.woff'
]

self.addEventListener('install', function (e) {
  self.skipWaiting()

  console.log('service worker installing')
  e.waitUntil(
    caches.open(version + 'waybot-web').then(function cacheOpener (cache) {
      console.log('cache opened', cache)
      return cache.addAll(cacheItems)
    })
  )
})

self.addEventListener('fetch', function fetchHandler (event) {
  // console.log('fetch event', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // console.log('SW response', response ? response : 'response is undefined?!')
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', function activator (event) {
  console.log('servie worker Activate even in progress:', event)
  // MDN sez: It is only activated when there are no longer any pages loaded
  // that are still using the old service worker. As soon as there are no
  // more such pages still loaded, the new service worker activates.
  // This is why it's OK to check 'update on reload' in browser tools
  event.waitUntil(
    caches.keys().then(function (keys) {
      console.log('caches found ' + keys)
      return Promise.all(
        keys.map(function (key) {
          console.log('service worker deleting a key ' + key)
          if (!key.startsWith(version)) {
            // return promise fulfilled when cache with this prefix is deleted
            return caches.delete(key)
          }
        })
      ).then(function () {
        console.log('old service worker caches deleted')
      })
    })
  )
})
