'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '__secret_admin__';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/${ADMIN_PATH}`);
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0E0C0A' }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(232,101,26,0.5)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return children;
}
