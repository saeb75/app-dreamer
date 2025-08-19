import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  Share,
  Text,
  View,
} from 'react-native';
import useSubs from '~/store/useSubs';
import useAuthStore from '~/store/useAuth';
import Header from './components/header';

type SettingsSectionProps = {
  title: string;
};

const SettingsSection = ({ title, children }: React.PropsWithChildren<SettingsSectionProps>) => (
  <View className="mb-6">
    <Text className="mb-2 px-6 text-sm font-medium text-gray-500">{title}</Text>
    <View className="overflow-hidden rounded-xl bg-white">{children}</View>
  </View>
);

type SettingsItemProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
};

const SettingsItem = ({
  label,
  icon,
  onPress,
  showChevron = true,
  rightContent,
}: SettingsItemProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4 active:bg-gray-50">
    <View className="flex-row items-center">
      <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-200">
        <Ionicons name={icon} size={18} color="#000" />
      </View>
      <Text className="text-base text-gray-800">{label}</Text>
    </View>
    <View className="flex-row items-center">
      {rightContent}
      {showChevron && <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
    </View>
  </Pressable>
);

export default function SettingsScreen() {
  const { restorePurchases, loading } = useSubs();
  const { logout } = useAuthStore();
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out DecoDreamer! I've been using it to redesign my spaces with AI. " +
          (Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/decodreamer/id123456789'
            : 'https://play.google.com/store/apps/details?id=com.decodreamer'),
        title: 'DecoDreamer App',
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while sharing');
    }
  };

  const handleRateApp = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/decodreamer/id123456789?action=write-review'
        : 'https://play.google.com/store/apps/details?id=com.decodreamer';

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not open app store');
      }
    });
  };

  const handleTerms = () => {
    router.push('/terms');
  };

  const handlePrivacy = () => {
    router.push('/privacy');
  };

  const handleRestore = () => {
    restorePurchases();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Settings" />
      <View className="px-6 py-4" />
      {/* <SettingsSection title="SHARE">
        <SettingsItem
          label="Rate DecoDreamer"
          icon="star-outline"
          onPress={handleRateApp}
        />
        <SettingsItem
          label="Share with Friends"
          icon="share-social-outline"
          onPress={handleShare}
          showChevron={false}
        />
      </SettingsSection> */}

      <SettingsSection title="SUBSCRIPTION">
        <SettingsItem
          label="Restore Purchases"
          icon="refresh-outline"
          onPress={handleRestore}
          showChevron={false}
          rightContent={
            loading ? <ActivityIndicator size="small" color="#f43f5e" className="mr-2" /> : null
          }
        />
        <SettingsItem
          label="Upgrade to Pro"
          icon="diamond-outline"
          onPress={() => router.push('/paywall')}
        />
      </SettingsSection>

      <SettingsSection title="LEGAL">
        <SettingsItem label="Terms of Service" icon="document-text-outline" onPress={handleTerms} />
        <SettingsItem
          label="Privacy Policy"
          icon="shield-checkmark-outline"
          onPress={handlePrivacy}
        />
      </SettingsSection>

      <SettingsSection title="ABOUT">
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-gray-800">Version</Text>
          <Text className="text-gray-500">{appVersion}</Text>
        </View>
      </SettingsSection>

      <SettingsSection title="ACCOUNT">
        <SettingsItem label="Logout" icon="log-out-outline" onPress={logout} showChevron={false} />
      </SettingsSection>

      <View className="mb-8 mt-auto items-center">
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-400">Made with </Text>
          <Ionicons name="heart" size={14} color="#f43f5e" />
          <Text className="text-sm text-gray-400"> by PixPose Team</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
