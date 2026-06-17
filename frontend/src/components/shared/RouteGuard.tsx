import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface Props { role: UserRole; }

export default function RouteGuard({ role }: Props) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/competitions'} replace />;
  }
  return <Outlet />;
}
