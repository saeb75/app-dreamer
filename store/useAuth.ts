import { create } from 'zustand';
import { AuthStore } from './types/useAuth.type';
import { appServices } from '~/services/AppServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;
      const user = await appServices.getUser(token);
      let userData = user?.data || user;

      set({ user: userData });
    } catch (error) {
      console.log({ error });
    }
  },

  loginGoogle: async (idToken) => {
    try {
      const response = await appServices.loginGoogle(idToken);

      const userData = response.user;
      const jwtToken = response.jwt;

      set({ user: userData, token: jwtToken });
      await AsyncStorage.setItem('token', jwtToken);
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Google' + JSON.stringify(error));
      console.log({ error });
    }
  },
  loginApple: async (identityToken) => {
    try {
      const response = await appServices.loginApple(identityToken);
      const userData = response.user;
      const jwtToken = response.jwt;

      set({ user: userData, token: jwtToken });
      await AsyncStorage.setItem('token', jwtToken);
    } catch (error) {
      console.log({ error });
    }
  },
  setStorage: async (token: string) => {
    await AsyncStorage.setItem('token', token);
  },
  getStorage: async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      set({ user: null, token: null });
    } catch (error) {
      console.log({ error });
    }
  },
}));

export default useAuthStore;
