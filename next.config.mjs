/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Card photos are copied from Google Drive into Vercel Blob by /api/refresh.
    remotePatterns: [new URL('https://*.public.blob.vercel-storage.com/**')],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
