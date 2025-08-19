import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
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
      <MotiView
        animate={{
          borderRadius: isSelected ? 20 : 12,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 150,
        }}
        style={{
          width: width / 2 - 20,
          height: (width / 2 - 20) * 1.5,
        }}
        className={`border-2 ${isSelected ? 'border-black' : 'border-transparent'} overflow-hidden`}>
        <Image
          source={{
            uri: image?.url,
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </MotiView>
      {/* <Text
        className={`text-center text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-500'} capitalize`}>
        {name}
      </Text> */}
    </Pressable>
  );
};

export default PosesCard;

const styles = StyleSheet.create({});
