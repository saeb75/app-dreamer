import React from 'react';
import AuthGuard from '../AuthGuard';

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, fallback }) => {
  return (
    <AuthGuard requireAuth={false} fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

export default PublicRoute;
