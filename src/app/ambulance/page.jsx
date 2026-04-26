import Layout from '../../components/Layout';
import AmbulanceContent from '../../page-components/AmbulancePage';


export const metadata = {
  title: 'Air Ambulance & Medical Flights — JETX.VIP',
  description: 'Emergency air ambulance and medical evacuation flights from and to Israel — worldwide. 24/7 availability, certified medical crews.',
  alternates: { canonical: 'https://jetx.vip/ambulance' },
  openGraph: {
    title: 'Air Ambulance Flights — JETX.VIP',
    description: 'Emergency medical air evacuation, anywhere in the world. Available 24/7.',
    url: 'https://jetx.vip/ambulance',
    images: [{ url: '/assets/social/og-medical.jpg', width: 1200, height: 800 }],
  },
};

export default function AmbulancePage() {
  return <Layout><AmbulanceContent /></Layout>;
}
