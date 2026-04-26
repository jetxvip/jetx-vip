import Layout from '../../components/Layout';
import FleetContent from '../../page-components/FleetPage';


export const metadata = {
  title: 'Our Fleet — JETX.VIP',
  description: 'Explore the JETX.VIP private jet fleet — from light jets to ultra-long-range aircraft. Every aircraft meticulously maintained and configured for luxury.',
  alternates: { canonical: 'https://jetx.vip/fleet' },
  openGraph: {
    title: 'Private Jet Fleet — JETX.VIP',
    description: 'Light jets, midsize, large cabin, and ultra-long-range aircraft available for charter.',
    url: 'https://jetx.vip/fleet',
  },
};

export default function FleetPage() {
  return <Layout><FleetContent /></Layout>;
}
