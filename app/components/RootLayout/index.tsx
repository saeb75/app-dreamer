import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex-1">{children}</SafeAreaView>;
};

export default RootLayout;

const styles = StyleSheet.create({});
