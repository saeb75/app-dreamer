import { Pressable, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useMemo, useEffect, useRef } from 'react';
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
  props = {
    ...props,
    state: {
      ...props.state,
      routes: props.state.routes.filter((route: any) => route.name !== 'index'),
    },
  };
  const animatedValue = useRef(new Animated.Value(props.state.index)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: props.state.index,
      useNativeDriver: false,
      easing: Easing.linear,
      duration: 200,
    }).start();
  }, [props.state.index]);

  const tabWidth = containerWidth / props.state.routes.length;
  const availableWidth = containerWidth - 8; // Container padding için 8px çıkar
  const adjustedTabWidth = availableWidth / props.state.routes.length;

  return (
    <View>
      <View
        className="flex  items-center justify-center overflow-hidden "
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 40,
          zIndex: 2,
        }}>
        <View
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          className="flex h-full w-60 flex-row overflow-hidden rounded-3xl bg-white p-1">
          {/* Animasyonlu Arka Plan */}
          {containerWidth > 0 && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 4,
                bottom: 4,
                width: adjustedTabWidth,
                backgroundColor: '#000',
                borderRadius: 20,
                left: 4,
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: props.state.routes.map((_, i) => i),
                      outputRange: props.state.routes.map((_, i) => i * adjustedTabWidth),
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}
            />
          )}

          {props.state.routes.map((route: any, index: number) => {
            return <CustomTab key={route.key} props={props} route={route} index={index} />;
          })}
        </View>
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
        className="flex-1 flex-col items-center justify-center rounded-3xl py-3">
        <Text
          className={`text-center text-base font-bold ${isFocused ? 'text-white' : 'text-black'}`}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

export default CustomTabs;

const styles = StyleSheet.create({});
