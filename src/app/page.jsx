import Layout from '../components/Layout';
import HomeContent from '../page-components/Home';
import IntroWrapper from './IntroWrapper';


export const metadata = {
  title: 'JETX.VIP — Private Aviation, Refined to Perfection',
  description: 'Ultra-premium private jet charter services worldwide. Discretion, speed, and personalization — tailored for those who expect the exceptional.',
  alternates: { canonical: 'https://jetx.vip/' },
  openGraph: {
    title: 'JETX.VIP — Private Aviation, Refined to Perfection',
    description: 'Ultra-premium private jet charter services worldwide. Experience true luxury at 45,000 feet.',
    url: 'https://jetx.vip/',
    images: [{ url: '/assets/social/og-main.jpg', width: 1200, height: 800 }],
  },
};

export default function HomePage() {
  return (
    <Layout>
      <IntroWrapper>
        <HomeContent />
      </IntroWrapper>
    </Layout>
  );
}
