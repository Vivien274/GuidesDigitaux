import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.guides-digitaux.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/downloads/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/api/download',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/precommande',
        destination: '/tunnel/formation-fiche-google',
        permanent: true,
      },
      {
        source: '/precommande/:path*',
        destination: '/tunnel/formation-fiche-google',
        permanent: true,
      },
      {
        source: '/tunnel/precommande-fiche-google',
        destination: '/tunnel/formation-fiche-google',
        permanent: true,
      },
      {
        source: '/links',
        destination: '/liens',
        permanent: false,
      },
      {
        source: '/linktree',
        destination: '/liens',
        permanent: false,
      },
      {
        source: '/liens-utiles',
        destination: '/liens',
        permanent: false,
      },
      {
        source: '/wp-content/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/vendre-sans-boutique-physique',
        destination: '/blog/vendre-sans-boutique-physique',
        permanent: true,
      },
      {
        source: '/categorie-produit/:path*',
        destination: '/boutique',
        permanent: true,
      },
      {
        source: '/conditions-generales-dutilisation',
        destination: '/cgu',
        permanent: true,
      },
      {
        source: '/formation/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
        destination: '/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
