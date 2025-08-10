import {
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MotiText, MotiView } from 'moti';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import { AnimatedView } from 'react-native-reanimated/lib/typescript/component/View';
import AnimateCard from '../AnimateCard';
let { width } = Dimensions.get('window');
const SexCard = ({
  title,
  description,
  image,
  sex,
  imageUrl1,
  imageUrl2,
}: {
  title: string;
  description: string;
  image: ImageSourcePropType;
  sex: 'male' | 'female';
  imageUrl1: string;
  imageUrl2: string;
}) => {
  return (
    <Pressable onPress={() => router.push('/steps')}>
      <View
        className={`mb-10  h-48 w-full flex-row items-center justify-between  rounded-lg  bg-gray-300 shadow-lg ${
          sex === 'male' ? '' : ''
        }`}>
        <View
          className={`w-full flex-1 flex-row justify-between ${sex !== 'male' ? 'flex-row-reverse' : ''}`}>
          <Animated.View
            layout={LinearTransition.springify().damping(10).stiffness(100)}
            className="flex-1 px-4 py-8"
            style={{
              width: width * 0.45,
            }}>
            <View className=" h-full flex-col justify-between">
              <View>
                <MotiText
                  entering={FadeIn.springify().damping(10).stiffness(100)}
                  exiting={FadeOut.springify().damping(10).stiffness(100)}
                  transition={{
                    delay: 500,
                    type: 'timing',
                    duration: 1000,
                  }}
                  className="mb-2 text-center text-lg font-bold text-black">
                  {title}
                </MotiText>
              </View>

              <View className="rounded-lg bg-black p-2 ">
                <MotiText
                  transition={{
                    delay: 5000,
                    type: 'timing',
                    duration: 2000,
                  }}
                  entering={sex !== 'male' ? FadeInLeft : FadeInRight}
                  exiting={sex !== 'male' ? FadeOutLeft : FadeOutRight}
                  className="text-center font-bold text-white">
                  Start Now
                </MotiText>
              </View>
            </View>
          </Animated.View>

          <View className="flex-[2] overflow-hidden rounded-lg shadow-lg">
            <AnimateCard imageUrl2={imageUrl2} imageUrl1={imageUrl1} title={title} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SexCard;

const styles = StyleSheet.create({});
