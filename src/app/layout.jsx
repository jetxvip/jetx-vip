import '../index.css';
import Providers from './Providers';
import StructuredData from './StructuredData';

export const metadata = {
  metadataBase: new URL('https://jetx.vip'),
  title: {
    default: 'JETX.VIP — Private Aviation, Refined to Perfection',
    template: '%s | JETX.VIP',
  },
  description: 'JETX.VIP offers ultra-premium private jet charter services worldwide. Discretion, speed, and personalization — tailored for those who expect the exceptional.',
  openGraph: {
    siteName: 'JETX.VIP',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/assets/social/og-main.jpg', width: 1200, height: 800, alt: 'JETX.VIP — Private Aviation' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/social/og-main.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&family=Bebas+Neue&family=Rubik:wght@300;400;500&family=Cairo:wght@300;400;600&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body>
        <StructuredData />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
