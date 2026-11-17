const CACHE_NAME = "market-crash-alert-v8";

/*
   캐시 키는 쿼리스트링(?v=, ?t=)을 뗀 주소로 통일한다.
   그래야 index.html의 ?v= 갱신과 data.json의 매 요청 주소가 달라도
   같은 항목을 덮어써 캐시가 무한히 쌓이지 않고 오프라인에서도 찾을 수 있다.
*/
const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

function cacheKey(request) {

    const url = new URL(request.url);

    return new Request(url.origin + url.pathname);
}

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    const key = cacheKey(request);

    const networkFirst = fetch(request)
        .then(response => {

            if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(key, copy));
            }

            return response;
        })
        .catch(() => caches.match(key).then(cached => {

            if (cached) {
                return cached;
            }

            if (request.mode === "navigate") {
                return caches.match("./index.html");
            }

            return Response.error();
        }));

    event.respondWith(networkFirst);
});
