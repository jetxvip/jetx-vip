import { notFound } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminContent from '../../../page-components/Admin';

export const dynamic = 'force-dynamic';

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '__secret_admin__';

export default async function AdminPanelPage({ params }) {
  const { lang } = await params;
  if (lang !== ADMIN_PATH) return notFound();
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
