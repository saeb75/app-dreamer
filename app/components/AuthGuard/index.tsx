import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router';
import useAuthStore from '~/store/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { user, getUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setAuthError(null);
      await getUser();
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthError('Authentication check failed');
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        {fallback || <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    );
  }

  // Show error state if auth check failed
  if (authError) {
    return <Redirect href={redirectTo as any} />;
  }

  // If auth is not required, show children regardless of user state
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Redirect to login if user is not authenticated and app is initialized
  if (isInitialized && !user) {
    return <Redirect href={redirectTo as any} />;
  }

  // Show children if user is authenticated
  return <>{children}</>;
};

export default AuthGuard;
