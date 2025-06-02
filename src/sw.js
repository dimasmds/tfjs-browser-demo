import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// Do precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Runtime caching
registerRoute(
  ({ url }) => {
    return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  () => true,
  new CacheFirst({
    cacheName: 'internal'
  }),
);
