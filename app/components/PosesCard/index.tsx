import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
const { width } = Dimensions.get('window');

const PosesCard = ({
  image,
  name,
  onPress,
  isSelected,
}: {
  image: any;
  name: string;
  onPress: () => void;
  isSelected: boolean;
}) => {
  return (
    <Pressable className="items-center justify-center rounded-lg " onPress={onPress}>
      <Image
        source={{
          uri: image.url,
        }}
        style={{
          width: width / 2 - 20,
          height: (width / 2 - 20) * 1.5,
        }}
        className={` rounded-lg ${isSelected ? 'border-2 border-black' : ''}`}
      />
      <Text
        className={`text-center text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>
        {name}
      </Text>
    </Pressable>
  );
};

export default PosesCard;

const styles = StyleSheet.create({});
