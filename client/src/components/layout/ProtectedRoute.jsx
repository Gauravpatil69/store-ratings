import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HOME_ROUTES } from '../../lib/constants';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-muted p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const home = HOME_ROUTES[user.role] || '/login';
    return <Navigate to={home} replace />;
  }

  return children;
}
