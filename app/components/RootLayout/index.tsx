import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import useAuthStore from '~/store/useAuth';
import { Redirect, router } from 'expo-router';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  return <SafeAreaView className="flex-1 bg-blue-50">{children}</SafeAreaView>;
};

export default RootLayout;

const styles = StyleSheet.create({});
