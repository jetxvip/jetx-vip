import { notFound } from 'next/navigation';
import LoginContent from '../../page-components/Login';

export const dynamic = 'force-dynamic';

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '__secret_admin__';

export default async function AdminLoginPage({ params }) {
  const { lang } = await params;
  if (lang !== ADMIN_PATH) return notFound();
  return <LoginContent />;
}
