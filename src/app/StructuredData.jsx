export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://jetx.vip/#organization',
        name: 'JETX.VIP',
        url: 'https://jetx.vip',
        logo: { '@type': 'ImageObject', url: 'https://jetx.vip/favicon.svg' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['English', 'Hebrew', 'Arabic', 'Russian'],
          hoursAvailable: 'Mo-Su 00:00-23:59',
        },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://jetx.vip/#website',
        url: 'https://jetx.vip',
        name: 'JETX.VIP',
        publisher: { '@id': 'https://jetx.vip/#organization' },
        inLanguage: ['en', 'he', 'ar', 'ru'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://jetx.vip/#service',
        name: 'JETX.VIP Private Aviation',
        url: 'https://jetx.vip',
        description: 'Ultra-premium private jet charter, air ambulance, and luxury aviation services worldwide.',
        priceRange: '$$$',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Hebrew', 'Arabic', 'Russian'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
