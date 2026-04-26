import PrivacyContent from '../../page-components/PrivacyPolicy';


export const metadata = {
  title: 'Privacy Policy — JETX.VIP',
  description: 'JETX.VIP privacy policy — how we collect, use, and protect your personal data.',
  alternates: { canonical: 'https://jetx.vip/privacy' },
  robots: { index: false },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
