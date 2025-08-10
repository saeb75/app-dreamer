import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import useAuthStore from '~/store/useAuth';
import { useRouter } from 'expo-router';
const MainHeader = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image source={require('../../../assets/logo.png')} className="h-10 w-10" />
          <View>
            <Text className="text-lg font-bold capitalize">Hello {user?.name}</Text>
            <Text className="text-xs text-gray-500">Welcome To ShowRoom AI</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="rounded-xl border border-gray-500 p-2">
            <Feather
              name="settings"
              size={16}
              color="black"
              onPress={() => router.push('/settings')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({});
