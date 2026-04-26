import Layout from '../../components/Layout';
import QuoteContent from '../../page-components/Quote';


export const metadata = {
  title: 'Request a Quote — JETX.VIP',
  description: 'Request a bespoke private jet charter quote from JETX.VIP. Immediate response, no obligation.',
  alternates: { canonical: 'https://jetx.vip/quote' },
  openGraph: {
    title: 'Request a Private Jet Quote — JETX.VIP',
    description: 'Get your personalised private aviation quote in minutes.',
    url: 'https://jetx.vip/quote',
  },
};

export default function QuotePage() {
  return <Layout><QuoteContent /></Layout>;
}
