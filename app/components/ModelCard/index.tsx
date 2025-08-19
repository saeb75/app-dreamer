import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';

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
    <Pressable className="items-center justify-center  " onPress={onPress}>
      <MotiView
        animate={{
          borderRadius: isSelected ? 20 : 12,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 150,
        }}
        className={`h-60 w-full border-2 ${isSelected ? 'border-black' : 'border-transparent'} overflow-hidden`}>
        <Image
          source={{
            uri: image?.url,
          }}
          resizeMode="cover"
          className="h-full w-full object-cover"
        />
      </MotiView>
      <Text
        className={`text-center text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>
        {name}
      </Text>
    </Pressable>
  );
};

export default ModelCard;

const styles = StyleSheet.create({});
