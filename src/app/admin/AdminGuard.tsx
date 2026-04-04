import { Navigate, Outlet } from 'react-router';
import { useAdmin } from '../contexts/AdminContext';

export function AdminGuard() {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
