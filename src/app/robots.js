export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/privacy', '/terms', '/accessibility'],
      },
    ],
    sitemap: 'https://jetx.vip/sitemap.xml',
    host: 'https://jetx.vip',
  };
}
