import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { RangeRequestsPlugin } from "workbox-range-requests";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), { denylist: [/^\/resources\//] }));

registerRoute(
  /\/resources\/.*\.(atlas|skel|json|png|webp)$/,
  new StaleWhileRevalidate({
    cacheName: "spine-model-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new RangeRequestsPlugin(),
      {
        requestWillFetch: async ({ request }) => {
          if (request.mode === "no-cors") return request;
          const cache = await caches.open("spine-model-cache");
          const existingResponse = await cache.match(request);
          if (existingResponse && (existingResponse.headers.has("ETag") || existingResponse.headers.has("Last-Modified"))) {
            const headers = new Headers(request.headers);
            if (existingResponse.headers.has("ETag")) headers.set("If-None-Match", existingResponse.headers.get("ETag"));
            if (existingResponse.headers.has("Last-Modified")) headers.set("If-Modified-Since", existingResponse.headers.get("Last-Modified"));
            return new Request(request, { headers });
          }
          return request;
        },
      },
    ],
  })
);
