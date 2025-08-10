import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import { MotiView } from 'moti';

type TabItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  component: React.ReactNode;
};

type TabsProps = {
  data: TabItem[];
  selectedIndex: number;
  onTabPress: (index: number) => void;
  activeBgColor: string;
  inactiveBgColor: string;
};
const spacing = 4;
const Tabs = ({ data, selectedIndex, onTabPress, activeBgColor, inactiveBgColor }: TabsProps) => {
  return (
    <View style={{ flexDirection: 'row', gap: spacing }} className="w-32 bg-red-400">
      {data.map((item, index) => (
        <MotiView layout={LinearTransition.springify().damping(80).stiffness(200)}>
          <Pressable
            style={{
              padding: spacing * 3,
              justifyContent: 'center',
              alignItems: 'center',
              gap: spacing,
              borderRadius: 10,

              backgroundColor: selectedIndex === index ? activeBgColor : inactiveBgColor,
              flexDirection: 'row',
            }}
            onPress={() => onTabPress(index)}>
            <Ionicons
              name={item.icon}
              size={24}
              color={selectedIndex === index ? 'white' : 'black'}
            />
            {selectedIndex === index && (
              <Animated.Text
                entering={FadeInRight.springify().damping(80).stiffness(200)}
                exiting={FadeOutRight.springify().damping(80).stiffness(200)}
                style={{
                  color: selectedIndex === index ? 'white' : 'black',
                }}>
                {item.name}
              </Animated.Text>
            )}
          </Pressable>
        </MotiView>
      ))}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({});
