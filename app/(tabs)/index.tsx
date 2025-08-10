import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import useAuthStore from '~/store/useAuth';

export default function Index() {
  return <Redirect href="/(tabs)/create" />;
}
