console.log("wlr SW at your service");
//constants
const APP_PREFIX = "FoodFest- ";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

//files we will cache locally
const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./schedule.html",
    "./tickets.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.main.bundle.js",
    "./dist/events.main.bundle.js",
    "./dist/tickets.main.bundle.js",
    "./dist/schedule.main.bundle.js"
];


//Q: why use self instead of window
//A: window object hasn't been created yet, using self to
//...instantiate listeners on the service worker!
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

//Activate event 
self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

//Fetch event
self.addEventListener('fetch', function(e) {
    console.log(`fetch request : ${e.request.url}`)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if(request) {
                console.log(`responding with cache : ${e.request.url}`);
                return request;
            } 
            else {
                console.log(`file is not cached, fetching : ${e.request.url}`);
                return fetch(e.request);
            }
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    );
});