import Layout from '../../../components/Layout';
import AircraftDetailContent from '../../../page-components/AircraftDetail';

export const metadata = {
  title: 'Aircraft Detail — JETX.VIP',
  description: 'Detailed specifications and booking information for this private jet.',
};

export default function AircraftDetailPage() {
  return <Layout><AircraftDetailContent /></Layout>;
}
