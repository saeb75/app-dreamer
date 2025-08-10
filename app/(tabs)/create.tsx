import { router, Stack } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import MainHeader from '../components/mainHeader';
import RootLayout from '../components/RootLayout';
import SexCard from '../components/SexCard';
import useAuthStore from '~/store/useAuth';
import AnimateCard from '../components/AnimateCard';

export default function Create() {
  const { user } = useAuthStore();

  return (
    <RootLayout>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <View className="">
        <MainHeader />
      </View>

      <View className="mt-10 px-4">
        <SexCard
          title="Be a model"
          description="Upload your photo and generate a virtual model"
          image={require('../../assets/images/auth-1.png')}
          sex="female"
          imageUrl1={
            'https://res.cloudinary.com/dg5aqbvj0/image/upload/v1754590164/edited_image_1754398845326_qrh92u.jpg'
          }
          imageUrl2={
            'https://res.cloudinary.com/dg5aqbvj0/image/upload/v1754590170/Screenshot_2025-08-05_at_15.58.33_a6aomc_ulvjho.jpg'
          }
          onPress={() => router.push('/ConvertSteps')}
        />
        <SexCard
          title="Generate Model"
          description="Upload your outfit and generate a virtual model"
          image={require('../../assets/main-man.png')}
          sex="male"
          imageUrl2={
            'https://res.cloudinary.com/dg5aqbvj0/image/upload/v1754592926/Untitled_design_1_t5t2n9.jpg'
          }
          imageUrl1={
            'https://res.cloudinary.com/dg5aqbvj0/image/upload/v1754592584/WhatsApp_Image_2025-08-07_at_21.32.28_li0j8m.jpg'
          }
          onPress={() => router.push('/GenerateSteps')}
        />
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
