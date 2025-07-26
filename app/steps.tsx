import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import RootLayout from './components/RootLayout';
import MainHeader from './components/mainHeader';
import Upload from './components/steps/upload';
import Header from './components/header';
import Models from './components/Models';
import Poses from './components/Poses';

const Steps = () => {
  const [step, setStep] = useState(1);
  return (
    <RootLayout>
      <Header title={step === 1 ? 'Upload Your Outfit' : 'Choose Your Model'} />
      <View className="flex-1 justify-between">
        <View className="mt-4 flex-1 px-4">
          {step === 1 && <Upload />}
          {step === 2 && <Models />}
          {step === 3 && <Poses />}
        </View>
        <View className="mb-8 px-4">
          <Pressable onPress={() => setStep(step + 1)} className="rounded-lg bg-black p-4">
            <Text className="text-center text-lg font-bold text-white">Next</Text>
          </Pressable>
        </View>
      </View>
    </RootLayout>
  );
};

export default Steps;

const styles = StyleSheet.create({});
