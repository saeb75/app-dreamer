import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { router } from 'expo-router';
let { width } = Dimensions.get('window');
const SexCard = ({
  title,
  description,
  image,
  sex,
}: {
  title: string;
  description: string;
  image: ImageSourcePropType;
  sex: 'male' | 'female';
}) => {
  return (
    <View
      className={`mb-10  h-64 w-full flex-row items-center justify-between rounded-lg bg-main-primary shadow-lg ${
        sex === 'male' ? '' : ''
      }`}>
      <View
        className={`w-full flex-row justify-between ${sex === 'male' ? 'flex-row-reverse' : ''}`}>
        <View
          className="px-4 py-8"
          style={{
            width: width * 0.45,
          }}>
          <View className="h-full flex-col justify-between">
            <View>
              <Text className="mb-2 text-2xl font-bold text-white">{title}</Text>
              <Text className=" font-bold text-gray-100">{description}</Text>
            </View>

            <Pressable onPress={() => router.push('/steps')}>
              <View className="rounded-lg bg-white p-2 ">
                <Text className="text-center font-bold text-black">Start Now</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View
          className="relative h-64"
          style={{
            width: width * 0.45,
          }}>
          <Image
            source={image}
            className={`absolute bottom-0  h-80 ${sex === 'male' ? 'left-2' : '-right-4'}`}
            style={{
              width: width * 0.5,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SexCard;

const styles = StyleSheet.create({});
