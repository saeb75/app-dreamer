import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo, Feather } from '@expo/vector-icons';
const MainHeader = () => {
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image source={require('../../../assets/logo.png')} className="h-10 w-10" />
          <View>
            <Text className="text-lg font-bold">Hello</Text>
            <Text className="text-xs text-gray-500">Welcome To ShowRoom AI</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="rounded-xl border border-gray-500 p-2">
            <Feather name="bell" size={16} color="black" />
          </View>
          <View className="rounded-xl border border-gray-500 p-2">
            <Feather name="settings" size={16} color="black" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({});
