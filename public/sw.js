/**
 * sw.js — service worker poison pill for jokuh.com root scope
 *
 * The previous web client registered a service worker at scope "/" with the
 * path "/sw.js". When the browser checks for an updated worker script, it
 * fetches this file. This replacement script immediately:
 *   1. Activates itself (skipWaiting)
 *   2. Claims all open clients so it controls every tab on jokuh.com
 *   3. Deletes every cache entry the old worker created
 *   4. Unregisters itself so no service worker controls jokuh.com at all
 *   5. Tells every controlled client to reload — they will then receive
 *      the real marketing page HTML from the network
 *
 * After this runs once, jokuh.com has no active service worker at "/".
 * The /sandbox/ client registers its own worker at "/sandbox/sw.js" with
 * scope "/sandbox/" and is unaffected.
 */

self.addEventListener("install", () => {
  // Skip waiting so this update activates immediately without waiting for
  // the old worker's clients to close.
  self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(
    (async () => {
      // Claim all open clients so this worker controls them right away.
      await self.clients.claim();

      // Wipe every cache the old worker created.
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister this service worker so jokuh.com runs without any SW at "/".
      await self.registration.unregister();

      // Reload all controlled clients so they fetch the real marketing page.
      const allClients = await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });
      allClients.forEach((client) => client.navigate(client.url));
    })()
  );
});
