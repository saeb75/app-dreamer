import { Link, Tabs } from 'expo-router';
import { View } from 'react-native';
import CustomFloatingTabBar from '../components/customTabbar';

import CustomTabs from '../components/customTabbar';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <View className="flex-1">
      <Tabs
        initialRouteName="create"
        tabBar={(props) => <CustomTabs props={props} />}
        screenOptions={{
          tabBarActiveTintColor: 'black',
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}>
        <Tabs.Screen
          name="models"
          options={{
            title: 'Models',
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',

            headerRight: () => <Link href="/modal" asChild></Link>,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome name="cog" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
