import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

import { Stack } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '~/store/store';
import AuthGuard from './components/AuthGuard';
import LoadingScreen from './components/LoadingScreen';
import useAuthStore from '~/store/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketServices from '~/services/SocketServices';
import { Alert, AppState, AppStateStatus, Image } from 'react-native';
import ApiService from '~/services';
import useGenerateStore from '~/store/useGenerate';
import { MotiView, View } from 'moti';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  let { fetchCategories, categoriesInitialized } = useAppStore();
  const { socketMessage, setSocketMessage, setSocketGenerations, fetchGenerations } =
    useGenerateStore();
  const { token } = useAuthStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchGenerations({ page: 1, pageSize: 64 });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const initializeApp = async () => {
    try {
      await fetchCategories();
      categoriesInitialized = true;
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
    };
  }, [user]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('App state changed to:', nextAppState);
    if (nextAppState === 'active' && user?.id) {
      // App came to foreground, reconnect socket if needed
      if (!SocketServices.connected) {
        console.log('Reconnecting socket after app became active');
        SocketServices.connect(user.id, setupSocketListeners);
        setupSocketListeners();
      }
    }
  };

  // Socket event listeners setup function
  const setupSocketListeners = useCallback(() => {
    // Clear existing listeners first
    SocketServices.offAll();

    // Event listeners
    SocketServices.onGenerationStarted((data) => {
      console.log('Generation started:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
      console.log({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onGenerationProgress((data) => {
      console.log('Generation progress:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
        timestamp: data?.timestamp,
      });
    });

    SocketServices.onCompositionCompleted((data) => {
      console.log('Composition completed:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onFaceSwapStarted((data) => {
      console.log('Face swap started:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onFaceSwapCompleted((data) => {
      console.log('Face swap completed:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onAIGenerationStarted((data) => {
      console.log('AI generation started:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onAIGenerationCompleted((data) => {
      console.log('AI generation completed:', data);
      setSocketMessage(data.message);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
      });
    });

    SocketServices.onGenerationCompleted((data) => {
      console.log('Generation completed:', data);
      Alert.alert('Generation completed', data);
      setSocketGenerations({
        generationId: data?.generationId,
        inputImage: data?.inputImage,
        faceSwapUrl: data?.faceSwapUrl,
        editedImageUrl: data?.editedImageUrl,
      });
    });

    SocketServices.onGenerationFailed((data) => {
      Alert.alert('Error', data.message || 'Generation failed');
      setSocketGenerations({
        generationId: data?.generationId,
        failed: true,
      });
    });
  }, [setSocketMessage, setSocketGenerations]);

  useEffect(() => {
    try {
      if (user?.id) {
        // Connect with callback to re-setup listeners on reconnection
        SocketServices.connect(user.id, setupSocketListeners);
        // Setup socket event listeners
        setupSocketListeners();
      }
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }, [user?.id, token, setupSocketListeners]);

  useEffect(() => {
    return () => {
      // Don't disconnect on component unmount, let AppState handle it
      SocketServices.offAll();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isLoading && (
        <Animated.View
          exiting={FadeOut.springify().damping(10).mass(1).stiffness(100)}
          className="absolute bottom-0 left-0 right-0 top-0 z-50">
          <Image
            source={require('~/assets/images/auth-4.jpg')}
            className="top-0 h-[104%] w-full object-contain"
          />
        </Animated.View>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
