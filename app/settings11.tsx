import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '~/store/useAuth';
import { router } from 'expo-router';
import Header from './components/header';
import RootLayout from './components/RootLayout';

export default function App() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    checkAppleAuthAvailability();
  }, []);

  const checkAppleAuthAvailability = async () => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAvailable(available);
      console.log('Apple Authentication available:', available);
    } catch (error) {
      console.error('Error checking Apple Auth availability:', error);
      setIsAvailable(false);
    }
  };
  const completeSignIn = async (credential: AppleAuthentication.AppleAuthenticationCredential) => {
    console.log({ credential: credential.identityToken });
    try {
      // const response = await fetch('http://localhost:1337/api/auth/apple-mobile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ identityToken: credential.identityToken }),
      // });
      // const { jwt, user } = await response.json();
      let res = await axios.post(process.env.EXPO_PUBLIC_CONTENT_API + '/api/auth/apple-mobile', {
        identityToken: credential.identityToken,
      });
      console.log(res.data);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const handleAppleSignIn = async () => {
    try {
      console.log('Starting Apple Sign In...');

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      completeSignIn(credential);
    } catch (e: any) {
      console.error('Apple Sign In error:', e);

      // Handle specific error cases
      if (e.code === 'ERR_CANCELED') {
        Alert.alert('Cancelled', 'Sign in was cancelled by the user.');
      } else if (e.code === 'ERR_INVALID_RESPONSE') {
        Alert.alert('Error', 'Invalid response from Apple. Please try again.');
      } else if (e.code === 'ERR_NOT_AVAILABLE') {
        Alert.alert('Not Available', 'Apple Sign In is not available on this device.');
      } else if (e.code === 'ERR_REQUEST_EXPIRED') {
        Alert.alert('Request Expired', 'The sign in request has expired. Please try again.');
      } else if (e.code === 'ERR_REQUEST_NOT_HANDLED') {
        Alert.alert('Request Not Handled', 'The sign in request was not handled properly.');
      } else if (e.code === 'ERR_REQUEST_INVALID') {
        Alert.alert('Invalid Request', 'The sign in request was invalid.');
      } else if (e.code === 'ERR_USER_NOT_FOUND') {
        Alert.alert('User Not Found', 'The user was not found.');
      } else if (e.code === 'ERR_USER_CANCELED') {
        Alert.alert('Cancelled', 'User cancelled the sign in process.');
      } else {
        Alert.alert('Error', `Sign in failed: ${e.message || 'Unknown error occurred'}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (isAvailable === null) {
    return (
      <View style={styles.container}>
        <Text>Checking Apple Sign In availability...</Text>
      </View>
    );
  }

  if (isAvailable === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Apple Sign In is not available on this device.</Text>
        <Text style={styles.infoText}>This could be because:</Text>
        <Text style={styles.infoText}>• You're not on iOS 13+ or macOS 10.15+</Text>
        <Text style={styles.infoText}>
          • Apple Sign In is not configured in your Apple Developer account
        </Text>
        <Text style={styles.infoText}>• The app is not properly configured for Apple Sign In</Text>
      </View>
    );
  }

  return (
    <RootLayout>
      <Header title="Settings" />
      <View className="flex-1 items-center justify-center">
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.button}
          onPress={handleAppleSignIn}
        />

        <View style={styles.spacing} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
  spacing: {
    height: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});
