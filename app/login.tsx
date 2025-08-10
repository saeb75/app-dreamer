import { Image, StyleSheet, Text, View, Platform, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import GoogleLogin from './components/Login/GoogleLogin';
import AppleLogin from './components/Login/AppleLogin';
import useAuthStore from '~/store/useAuth';
import { Redirect, router } from 'expo-router';
import PublicRoute from './components/PublicRoute';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const Login = () => {
  let { user } = useAuthStore();

  // useEffect(() => {
  //   if (user) {
  //     return router.replace('/(tabs)/create');
  //   }
  // }, [user]);
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <PublicRoute
      fallback={
        <>
          <Image
            source={require('~/assets/images/auth-5.jpg')}
            className="top-0 h-[104%] w-full object-contain"
          />
        </>
      }>
      <View className="flex-1 items-center justify-center">
        <View className="absolute h-full w-full ">
          <Image
            source={require('~/assets/images/auth-5.jpg')}
            className="top-0 h-[104%] w-full object-contain"
          />
          <LinearGradient
            // colors={[
            //   'transparent',
            //   'rgba(26, 42, 128, 0.8)',
            //   'rgba(26, 42, 128, 0.9)',
            //   'rgba(26, 42, 128,1)',
            // ]}
            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1)']}
            locations={[0.5, 0.67, 0.9, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </View>
        <View className="w-full flex-1 justify-end pb-12">
          <View className="flex w-full flex-1 flex-col items-center justify-end">
            <Text className="w-full px-5 pb-2  text-left text-3xl font-semibold text-white">
              Welcome to ModelHub
            </Text>
            <Text className="w-full px-5 pb-2 text-left text-white">
              Create an account to get started
            </Text>
            <GoogleLogin />
            <View className="h-4 w-32" />
            <AppleLogin />
          </View>
          <Text className="m-4 px-4 font-bold text-white">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </PublicRoute>
  );
};

export default Login;

const styles = StyleSheet.create({});
