import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, Text, Dimensions } from 'react-native';
import { MotiView } from 'moti';

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

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className="items-center justify-center">
      <MotiView
        animate={{
          scale: isPressed ? 0.95 : 1,
          borderRadius: isSelected ? 20 : 12,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 150,
        }}
        className={`h-44 w-44 border-2 ${
          isSelected ? 'border-blue-500' : 'border-transparent'
        } overflow-hidden shadow-lg`}>
        <View className="relative h-full w-full">
          {/* First Image */}
          <MotiView
            animate={{
              opacity: currentImage === 0 ? 1 : 0,
              scale: currentImage === 0 ? 1 : 0.95,
            }}
            transition={{
              type: 'timing',
              duration: 500,
            }}
            className="absolute inset-0">
            <Image source={{ uri: imageUrl1 }} className="h-full w-full" resizeMode="cover" />
          </MotiView>

          {/* Second Image */}
          <MotiView
            animate={{
              opacity: currentImage === 1 ? 1 : 0,
              scale: currentImage === 1 ? 1 : 0.95,
            }}
            transition={{
              type: 'timing',
              duration: 500,
            }}
            className="absolute inset-0">
            <Image source={{ uri: imageUrl2 }} className="h-full w-full" resizeMode="cover" />
          </MotiView>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 150,
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
                duration: 300,
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
                duration: 300,
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
