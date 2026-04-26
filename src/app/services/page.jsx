import Layout from '../../components/Layout';
import ServicesContent from '../../page-components/Services';


export const metadata = {
  title: 'Private Jet Services — JETX.VIP',
  description: 'Charter flights, business aviation, VIP services, and medical flights — JETX.VIP provides the full spectrum of premium private aviation.',
  alternates: { canonical: 'https://jetx.vip/services' },
  openGraph: {
    title: 'Private Jet Services — JETX.VIP',
    description: 'Charter, business, VIP and medical aviation — all under one roof.',
    url: 'https://jetx.vip/services',
  },
};

export default function ServicesPage() {
  return <Layout><ServicesContent /></Layout>;
}
