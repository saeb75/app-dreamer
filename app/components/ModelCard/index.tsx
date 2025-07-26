import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ModelCard = ({
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
        className={`h-44 w-44 rounded-lg ${isSelected ? 'border-2 border-black' : ''}`}
      />
      <Text
        className={`text-center text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>
        {name}
      </Text>
    </Pressable>
  );
};

export default ModelCard;

const styles = StyleSheet.create({});
