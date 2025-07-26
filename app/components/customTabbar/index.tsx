import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type CustomTabsProps = {
  props: BottomTabBarProps;
};

type CustomTabProps = {
  props: BottomTabBarProps;
  route: any;
  index: number;
};

const CustomTabs = ({ props }: CustomTabsProps) => {
  return (
    <View
      className="flex items-center justify-center overflow-hidden"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        zIndex: 2,
      }}>
      <View className="flex h-full w-[60%] flex-row overflow-hidden rounded-3xl bg-white p-1">
        {props.state.routes.map((route: any, index: number) => {
          return <CustomTab key={route.key} props={props} route={route} index={index} />;
        })}
      </View>
    </View>
  );
};

const CustomTab = ({ props, route, index }: CustomTabProps) => {
  const { options } = props.descriptors[route.key];

  const label = options.title;
  if (!label) {
    return null;
  }

  const isFocused = useMemo(() => props.state.index === index, [props.state.index, index]);

  const onPress = () => {
    const event = props.navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      props.navigation.navigate(route.name);
    }
  };

  return (
    <View className="flex-1">
      <Pressable
        onPress={onPress}
        className={`flex-1 flex-col items-center justify-center rounded-3xl py-3 ${
          isFocused ? 'bg-black' : ''
        }`}>
        <Text
          className={`text-center text-sm font-bold ${isFocused ? 'text-white' : 'text-black'}`}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

export default CustomTabs;

const styles = StyleSheet.create({});
