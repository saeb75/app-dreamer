import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import useAuthStore from '~/store/useAuth';
import { useRouter } from 'expo-router';
import useSubs from '~/store/useSubs';
const MainHeader = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { isPro } = useSubs();
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
          {!isPro && (
            <Pressable
              onPress={() => {
                router.push('/paywall');
              }}>
              <View className="rounded-full bg-rose-500 px-3 py-1">
                <Text className="text-lg font-semibold text-white">Pro</Text>
              </View>
            </Pressable>
          )}
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
