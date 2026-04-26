import Layout from '../../components/Layout';
import AboutContent from '../../page-components/About';


export const metadata = {
  title: 'About Us — JETX.VIP',
  description: 'Learn about JETX.VIP — founded by aviation veterans and luxury travel specialists redefining private jet charter with uncompromising standards.',
  alternates: { canonical: 'https://jetx.vip/about' },
  openGraph: {
    title: 'About JETX.VIP',
    description: 'Our story, our mission, and what sets us apart in private aviation.',
    url: 'https://jetx.vip/about',
  },
};

export default function AboutPage() {
  return <Layout><AboutContent /></Layout>;
}
