import { Stack } from 'expo-router';

import { StyleSheet, View } from 'react-native';

import MainHeader from '../components/mainHeader';
import RootLayout from '../components/RootLayout';
import SexCard from '../components/SexCard';

export default function Create() {
  return (
    <RootLayout>
      {/* <Stack.Screen options={{ title: 'Tab One' }} /> */}
      <View className="">
        <MainHeader />
      </View>
      <View className="mt-24 px-4">
        <SexCard
          title="Style Her Up"
          description="Upload a women's outfit and generate a virtual model"
          image={require('../../assets/main-girl.png')}
          sex="female"
        />
        <SexCard
          title="Dress Him Up"
          description="Upload a men's outfit and generate a virtual model"
          image={require('../../assets/main-man.png')}
          sex="male"
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
