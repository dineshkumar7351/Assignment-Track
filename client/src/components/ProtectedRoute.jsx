import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute: Enforces authentication and role-based access control
 * @param {Array<string>} allowedRoles Optional list of roles permitted to access this route
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Verifying authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated users to login, remembering the attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if restricted
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
