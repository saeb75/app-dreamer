import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Pressable,
  Text,
  Dimensions,
  Animated,
  Easing as RNEasing,
} from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface AnimateCardProps {
  imageUrl1: string;
  imageUrl2: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  autoAnimate?: boolean;
  animationDuration?: number;
}

const AnimateCard: React.FC<AnimateCardProps> = ({
  imageUrl1,
  imageUrl2,
  title,
  subtitle,
  onPress,
  isSelected = false,
  disabled = false,
  autoAnimate = true,
  animationDuration = 2000,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const animeValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      setIsPressed(false);
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Auto animation effect
  useEffect(() => {
    if (!autoAnimate) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, animationDuration);

    return () => clearInterval(interval);
  }, [autoAnimate, animationDuration]);

  // Border animation effect (like SwapCard)
  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animeValue, {
            toValue: 1,
            duration: 3000,
            delay: 1000,
            easing: RNEasing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: false,
          }),
          Animated.timing(animeValue, {
            toValue: 0,
            duration: 3000,
            easing: RNEasing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: false,
          }),
        ]),
        {
          iterations: 2,
        }
      ).start();
    } else {
      animeValue.setValue(0);
    }
  }, [isSelected]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className="items-center justify-center">
      <MotiView
        // animate={{
        //   scale: isPressed ? 0.95 : 1,
        //   borderRadius: isSelected ? 20 : 12,
        // }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 100,
        }}
        className={`h-40 w-64 border-2 ${
          isSelected ? 'border-blue-500' : 'border-transparent'
        } overflow-hidden shadow-lg`}>
        {/* Animated border effect */}
        {isSelected && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderWidth: 2,
              borderColor: 'rgba(59, 130, 246, 0.5)',
              borderRadius: 12,
              opacity: animeValue,
            }}
          />
        )}
        <View className=" relative h-full w-full flex-row justify-end bg-blue-200">
          {/* Background Image (First Image) */}

          <MotiView
            animate={{
              width: currentImage === 0 ? 256 : 0,
            }}
            transition={{
              type: 'timing',
              duration: 1500,
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            }}
            className="absolute bottom-0 right-0 top-0 overflow-hidden bg-red-400">
            <Image source={{ uri: imageUrl1 }} className="h-full w-full" resizeMode="cover" />
          </MotiView>
          {/* Foreground Image (Second Image) with clipping */}
          <MotiView
            animate={{
              width: currentImage === 0 ? 0 : 300,
            }}
            transition={{
              type: 'timing',
              duration: 1500,
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            }}
            className="absolute bottom-0 left-0 top-0 overflow-hidden">
            <Image source={{ uri: imageUrl2 }} className="h-full w-full" resizeMode="cover" />
          </MotiView>

          {/* Divider Line */}
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <MotiView
            // from={{ opacity: 0, scale: 0.5 }}
            // animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 100,
            }}
            className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-xs font-bold text-white">✓</Text>
          </MotiView>
        )}
      </MotiView>

      {/* Text Content */}
      {(title || subtitle) && (
        <View className="mt-2 items-center">
          {title && (
            <MotiView
              animate={{
                opacity: isSelected ? 1 : 0.7,
              }}
              transition={{
                type: 'timing',
                duration: 800,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
              }}>
              <Text
                className={`text-center text-lg font-bold ${
                  isSelected ? 'text-blue-600' : 'text-gray-700'
                }`}>
                {title}
              </Text>
            </MotiView>
          )}

          {subtitle && (
            <MotiView
              animate={{
                opacity: isSelected ? 0.8 : 0.5,
              }}
              transition={{
                type: 'timing',
                duration: 800,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
              }}>
              <Text
                className={`text-center text-sm ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
                {subtitle}
              </Text>
            </MotiView>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default AnimateCard;
