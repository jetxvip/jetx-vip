import Layout from '../../components/Layout';
import EmptyLegsContent from '../../page-components/EmptyLegs';


export const metadata = {
  title: 'Empty Leg Flights — JETX.VIP',
  description: 'Exclusive empty leg private jet deals — fly at a fraction of the cost on repositioning flights. Updated daily by JETX.VIP.',
  alternates: { canonical: 'https://jetx.vip/empty-legs' },
  openGraph: {
    title: 'Empty Leg Flights — JETX.VIP',
    description: 'Premium private jet empty legs at exclusive prices. Limited availability.',
    url: 'https://jetx.vip/empty-legs',
  },
};

export default function EmptyLegsPage() {
  return <Layout><EmptyLegsContent /></Layout>;
}
