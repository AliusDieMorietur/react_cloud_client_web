"use strict";

const version = "v1";

const files = ["/"];

self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(version).then((cache) => cache.addAll(files)))
);

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response !== undefined) return response;
      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(version).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch((error) => {
          throw error;
        });
    })
  );
});
