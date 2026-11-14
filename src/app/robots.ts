import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.guides-digitaux.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/mon-compte', '/panier', '/tunnel/confirmation'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
