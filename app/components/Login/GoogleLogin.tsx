import { Alert, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useAuthStore from '~/store/useAuth';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const GoogleLogin = () => {
  const { loginGoogle } = useAuthStore();

  const startSignInFlow = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo?.data?.idToken) {
        loginGoogle(userInfo?.data?.idToken);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Google' + JSON.stringify(error));
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.customButton} onPress={startSignInFlow} activeOpacity={0.8}>
        <View style={styles.buttonContent}>
          <AntDesign name="google" size={18} color="black" className="mr-2" />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: width * 0.9,
    height: width * 0.13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
