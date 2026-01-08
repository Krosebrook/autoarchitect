import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, loading, isSupabaseEnabled } = useAuth();

  // If Supabase is not enabled, allow access (offline mode)
  if (!isSupabaseEnabled) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback || <div>Please sign in to continue</div>}</>;
  }

  return <>{children}</>;
};
