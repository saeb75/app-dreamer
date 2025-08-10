import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { MotiView } from 'moti';
import RootLayout from './components/RootLayout';
import MainHeader from './components/mainHeader';

import Header from './components/header';

import useGenerateStore from '~/store/useGenerate';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import Models from './components/steps/models';
import Upload from './components/steps/upload';
import Poses from './components/steps/poses';

const Steps = () => {
  const [step, setStep] = useState(1);
  const { generateImage } = useGenerateStore();
  return (
    <RootLayout>
      <Header
        title={
          step === 1 ? 'Upload Your Outfit' : step === 2 ? 'Choose Your Model' : 'Choose Your Pose'
        }
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
      />
      <Animated.View
        className="flex-1 justify-between"
        layout={LinearTransition.springify().damping(80).stiffness(200)}>
        <View className="mt-4 flex-1 px-4">
          {step === 1 && (
            <Animated.View
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              className="flex-1">
              <Upload />
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View
              className="flex-1"
              entering={FadeInDown.springify().damping(80).stiffness(200)}>
              <Models />
            </Animated.View>
          )}
          {step === 3 && (
            <Animated.View
              className="flex-1"
              entering={FadeInDown.springify().damping(80).stiffness(200)}>
              <Poses />
            </Animated.View>
          )}
        </View>
        <View className="mb-8 flex-row justify-between gap-2 px-4">
          <MotiView
            animate={{
              opacity: step > 1 ? 1 : 0,
              scale: step > 1 ? 1 : 0.8,
              width: step > 1 ? 'auto' : 0,
              flex: step > 1 ? 1 : 0,
            }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 150,
            }}>
            {step > 1 && (
              <Pressable
                onPress={() => {
                  setStep(step - 1);
                }}
                className="flex-1 rounded-lg bg-white p-4">
                <Text className="text-center text-lg font-bold text-black">Back</Text>
              </Pressable>
            )}
          </MotiView>

          <MotiView
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 150,
            }}
            className="flex-[4] rounded-lg bg-black p-4">
            <Pressable
              onPress={() => {
                if (step === 3) {
                  generateImage();
                  // router.push('/generate');
                  router.push('/models');
                } else {
                  setStep(step + 1);
                }
              }}>
              <Text className="text-center text-lg font-bold text-white">
                {step === 3 ? 'Generate' : 'Next'}
              </Text>
            </Pressable>
          </MotiView>
        </View>
      </Animated.View>
    </RootLayout>
  );
};

export default Steps;

const styles = StyleSheet.create({});
