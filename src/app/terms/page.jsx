import TermsContent from '../../page-components/TermsOfUse';


export const metadata = {
  title: 'Terms of Use — JETX.VIP',
  description: 'Terms and conditions governing use of the JETX.VIP website and services.',
  alternates: { canonical: 'https://jetx.vip/terms' },
  robots: { index: false },
};

export default function TermsPage() {
  return <TermsContent />;
}
