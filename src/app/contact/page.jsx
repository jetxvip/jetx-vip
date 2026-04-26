import Layout from '../../components/Layout';
import ContactContent from '../../page-components/Contact';


export const metadata = {
  title: 'Contact Us — JETX.VIP',
  description: 'Get in touch with JETX.VIP for private jet charter enquiries. Available 24/7 for discretionary, personalized service.',
  alternates: { canonical: 'https://jetx.vip/contact' },
  openGraph: {
    title: 'Contact JETX.VIP',
    description: 'Reach our aviation advisors 24/7 for private jet charter bookings and enquiries.',
    url: 'https://jetx.vip/contact',
  },
};

export default function ContactPage() {
  return <Layout><ContactContent /></Layout>;
}
