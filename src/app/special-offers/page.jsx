import Layout from '../../components/Layout';
import SpecialOffersContent from '../../page-components/SpecialOffers';


export const metadata = {
  title: 'Special Offers — JETX.VIP',
  description: 'Exclusive private jet special offers from JETX.VIP. Limited availability luxury aviation deals.',
  alternates: { canonical: 'https://jetx.vip/special-offers' },
};

export default function SpecialOffersPage() {
  return <Layout><SpecialOffersContent /></Layout>;
}
