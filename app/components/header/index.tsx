import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title }: { title: string }) => {
  return (
    <View className="flex-row items-center justify-between px-4">
      <View className="w-1/4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" className="text-black" />
        </Pressable>
      </View>
      <Text className="w-1/2 text-center text-lg font-bold">{title}</Text>
      <View className="w-1/4 text-center text-lg font-bold"></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
