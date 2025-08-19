// import appsFlyerService from '@/services/appsflyer';
// import FirebaseService from '@/services/firebase';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import useSubs from '~/store/useSubs';

const FEATURES = [
  {
    title: 'Premium Models',
    icon: 'infinite-outline' as const,
  },
  {
    title: 'Premium Poses',
    icon: 'flash-outline' as const,
  },
  {
    title: 'Advanced AI',
    icon: 'color-palette-outline' as const,
  },
];

const calculateSavingsPercentage = (subs: any[]) => {
  const monthlyPlan = subs.find((sub) => sub.identifier.includes('monthly'));
  const annualPlan = subs.find((sub) => sub.identifier.includes('annual'));

  if (!monthlyPlan || !annualPlan) return 50; // Default fallback

  const monthlyPrice = monthlyPlan.product.price;
  const annualPrice = annualPlan.product.price;
  const monthlyTotal = monthlyPrice * 12;

  if (monthlyTotal <= annualPrice) return 0;

  const savings = ((monthlyTotal - annualPrice) / monthlyTotal) * 100;
  return Math.round(savings);
};

// Function to get trial information
const getTrialInfo = (sub: any) => {
  // Check if subscription has trial period
  if (sub.product.introductoryPrice) {
    const trial = sub.product.introductoryPrice;
    const trialPeriod = trial.periodNumberOfUnits;
    const trialUnit = trial.periodUnit;

    // Convert to readable format
    let trialText = '';
    if (trialUnit === 'DAY') {
      trialText = trialPeriod === 1 ? '1 day' : `${trialPeriod} days`;
    } else if (trialUnit === 'WEEK') {
      trialText = trialPeriod === 1 ? '1 week' : `${trialPeriod} weeks`;
    } else if (trialUnit === 'MONTH') {
      trialText = trialPeriod === 1 ? '1 month' : `${trialPeriod} months`;
    }

    return trialText;
  }
  return null;
};

export default function PaywallScreen() {
  const { loading, subs, selectedSub, setSelectedSub, getSubs, purchaseSub, restorePurchases } =
    useSubs();

  useEffect(() => {
    getSubs();
    // Track paywall view
    // appsFlyerService.logPaywallViewed();
    // const firebaseService = FirebaseService.getInstance();
    // firebaseService.logPaywallEvent("viewed");
  }, []);

  const handleClose = () => {
    // Track paywall dismiss
    // appsFlyerService.logPaywallDismissed();
    // const firebaseService = FirebaseService.getInstance();
    // firebaseService.logPaywallEvent("dismissed");
    router.back();
  };

  const handleSelectPlan = (sub: (typeof subs)[0]) => {
    setSelectedSub(sub);
  };

  const handlePurchase = async () => {
    if (!selectedSub) {
      Alert.alert('Please select a subscription plan');
      return;
    }

    try {
      // Track subscription start
      //   await appsFlyerService.logSubscriptionStarted(
      //     selectedSub.identifier,
      //     selectedSub.product.price,
      //     selectedSub.product.currencyCode || 'USD'
      //   );

      //   const firebaseService = FirebaseService.getInstance();
      //   await firebaseService.logSubscriptionEvent('started', selectedSub.identifier);

      await purchaseSub();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleRestore = () => {
    restorePurchases();
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background Gradient */}
      <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} className="absolute inset-0" />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4 pt-4">
          <View className="flex-row items-center">
            <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500">
              <Ionicons name="diamond" size={16} color="white" />
            </View>
            <Text className="text-lg font-bold text-white">Premium Access</Text>
          </View>
          <Pressable
            onPress={handleClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-between px-6">
          {/* Top Section */}
          <View>
            {/* Hero */}
            <View className="mb-6 items-center">
              <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500">
                <Ionicons name="sparkles" size={24} color="white" />
              </View>
              <Text className="mb-1 text-center text-2xl font-bold text-white">Unlock Premium</Text>
              <Text className="text-center text-base text-gray-300">
                Create AI models and poses
              </Text>
            </View>

            {/* Features Grid */}
            <View className="mb-6">
              <View className="grid grid-cols-2 gap-3">
                {FEATURES.map((feature, index) => (
                  <View
                    key={feature.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <View className="flex-row items-center">
                      <View className="mr-2 h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20">
                        <Ionicons name={feature.icon} size={16} color="#f43f5e" />
                      </View>
                      <Text className="flex-1 text-sm font-medium text-white">{feature.title}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Subscription Plans */}
            <View className="mb-4">
              {subs.length > 0 ? (
                <View className="space-y-2">
                  {subs.map((sub, index) => (
                    <Pressable
                      key={sub.identifier}
                      onPress={() => handleSelectPlan(sub)}
                      className={`mb-4 rounded-xl border p-3 ${
                        selectedSub?.identifier === sub.identifier
                          ? 'border-rose-500 bg-gradient-to-r from-rose-500/10 to-pink-500/10'
                          : 'border-white/20 bg-white/5'
                      }`}>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-base font-bold text-white">
                            {sub.identifier.includes('monthly')
                              ? 'Monthly'
                              : sub.identifier.includes('annual')
                                ? 'Annual'
                                : sub.identifier.includes('weekly')
                                  ? 'Weekly'
                                  : 'Premium'}
                          </Text>
                          <Text className="text-xs text-gray-400">
                            {(() => {
                              const trialInfo = getTrialInfo(sub);
                              if (sub.identifier.includes('annual')) {
                                const savings = calculateSavingsPercentage(subs);
                                return trialInfo
                                  ? `${trialInfo} free trial • Save ${savings}% • Best Value`
                                  : `Save ${savings}% • Best Value`;
                              } else {
                                return trialInfo
                                  ? `${trialInfo} free trial • Unlimited access`
                                  : 'Unlimited access';
                              }
                            })()}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-lg font-bold text-white">
                            {sub.product.priceString}
                          </Text>
                          <Text className="text-xs text-gray-400">
                            {sub.identifier.includes('monthly')
                              ? '/month'
                              : sub.identifier.includes('annual')
                                ? '/year'
                                : ''}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : loading ? (
                <View className="h-20 items-center justify-center rounded-xl bg-white/5">
                  <ActivityIndicator color="#f43f5e" size="small" />
                  <Text className="mt-1 text-xs text-gray-400">Loading subscription plans...</Text>
                </View>
              ) : (
                <View className="h-20 items-center justify-center rounded-xl bg-white/5">
                  <Ionicons name="alert-circle" size={24} color="#6b7280" />
                  <Text className="mt-1 text-xs text-gray-400">
                    Unable to load subscription plans
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Section */}
          <View>
            {/* Purchase Button */}
            <Pressable
              onPress={handlePurchase}
              disabled={loading || !selectedSub}
              className={`mb-3 rounded-xl py-3 ${
                loading || !selectedSub ? 'bg-gray-600' : 'bg-rose-500'
              }`}>
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-center text-base font-bold text-white">
                  {selectedSub
                    ? (() => {
                        const trialInfo = getTrialInfo(selectedSub);
                        if (trialInfo) {
                          return `Start ${trialInfo} free trial`;
                        }
                        return `Get Premium for ${selectedSub.product.priceString}`;
                      })()
                    : 'Select a subscription plan'}
                </Text>
              )}
            </Pressable>

            {/* Restore Purchases */}
            <Pressable onPress={handleRestore} disabled={loading} className="mb-4 py-2">
              <Text className="text-center text-sm font-medium text-gray-400">
                Restore Purchases
              </Text>
            </Pressable>

            {/* Terms and Privacy */}
            <View className="px-4">
              <View className="mb-2 flex-row justify-center space-x-4">
                <Pressable onPress={() => Linking.openURL('https://www.roomredesign.ai/terms')}>
                  <Text className="text-xs font-medium text-rose-400 underline">
                    Terms of Service
                  </Text>
                </Pressable>
                <Pressable
                  className="ml-4"
                  onPress={() => Linking.openURL('https://www.roomredesign.ai/privacy')}>
                  <Text className="text-xs font-medium text-rose-400 underline">
                    Privacy Policy
                  </Text>
                </Pressable>
              </View>
              <Text className="text-center text-xs text-gray-500">
                Subscriptions automatically renew unless canceled
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
