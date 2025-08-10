import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => {
  const prevTitle = useRef(title);

  useEffect(() => {
    prevTitle.current = title;
  }, [title]);

  return (
    <View className="flex-row items-center justify-between px-4">
      <View className="w-1/4 flex-row items-center justify-between">
        <Pressable onPress={onBack ? onBack : () => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" className="text-black" />
        </Pressable>
      </View>
      <MotiView
        key={title} // This forces re-animation when title changes
        from={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
        className="w-1/2">
        <Text className="text-center text-lg font-bold">{title}</Text>
      </MotiView>
      <View className="w-1/4 text-center text-lg font-bold"></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
