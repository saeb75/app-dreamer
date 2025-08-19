import { Alert } from 'react-native';
// import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { create } from 'zustand';

import { router } from 'expo-router';

type Subs = {
  // isPro: boolean;
  // subs: PurchasesPackage[];
  // loading: boolean;
  // getOffersError: string | null;
  // selectedSub: PurchasesPackage | null;
  // customerInfo: CustomerInfo | null;
  // setSelectedSub: (sub: PurchasesPackage) => void;
  // setIsPro: (isPro: boolean) => void;
  // getSubs: () => void;
  // purchaseSub: () => void;
  // restorePurchases: () => void;
  // getCustomerInfo: () => Promise<void>;
};
const useSubs = create<Subs>((set, get) => ({
  // loading: false,
  // isPro: false,
  // subs: [],
  // setSelectedSub: (sub: PurchasesPackage) => set({ selectedSub: sub }),
  // selectedSub: null,
  // getOffersError: null,
  // customerInfo: null,
  // setIsPro: (isPro: boolean) => set({ isPro }),
  // getSubs: async () => {
  //   try {
  //     const offerings = await Purchases.getOfferings();
  //     if (offerings?.current) {
  //       const _offers: PurchasesPackage[] = offerings.current.availablePackages;
  //       console.log({ _offers });
  //       set({ subs: _offers, selectedSub: _offers[0], getOffersError: null });
  //     } else {
  //       set({ getOffersError: 'error' });
  //     }
  //   } catch (e) {
  //     set({ getOffersError: JSON.stringify(e) });
  //     console.log('🚀 ~ getSubs error:', e);
  //   }
  // },
  // purchaseSub: async () => {
  //   set({ loading: true });
  //   const selectedSub = get().selectedSub;
  //   if (!selectedSub?.identifier) {
  //     set({ loading: false });
  //     return;
  //   }
  //   try {
  //     const { productIdentifier } = await Purchases.purchasePackage(selectedSub);
  //     set({ loading: false });
  //     if (productIdentifier) {
  //       // Refresh customer info after successful purchase
  //       await get().getCustomerInfo();
  //       router.back();
  //     }
  //   } catch (e) {
  //     set({ loading: false });
  //     console.log('🚀 ~ purchaseSub error:', e);
  //   }
  // },
  // restorePurchases: async () => {
  //   set({ loading: true });
  //   try {
  //     const restore = await Purchases.restorePurchases();
  //     set({ loading: false });
  //     if (restore.activeSubscriptions.length > 0) {
  //       Alert.alert('Success', 'You are already subscribed');
  //       set({ isPro: true });
  //     }
  //   } catch (e) {
  //     set({ loading: false });
  //     Alert.alert('Error', 'Something went wrong');
  //   }
  // },
  // getCustomerInfo: async () => {
  //   try {
  //     set({ loading: true });
  //     const customerInfo = await Purchases.getCustomerInfo();
  //     // Check if user has any active subscriptions or non-consumable purchases
  //     const hasActiveSubscription = Object.keys(customerInfo.activeSubscriptions).length > 0;
  //     const hasNonConsumablePurchases =
  //       Object.keys(customerInfo.nonSubscriptionTransactions).length > 0;
  //     const isPro = hasActiveSubscription || hasNonConsumablePurchases;
  //     set({
  //       customerInfo,
  //       isPro,
  //       loading: false,
  //     });
  //     console.log('Customer Info:', {
  //       activeSubscriptions: customerInfo.activeSubscriptions,
  //       nonSubscriptionTransactions: customerInfo.nonSubscriptionTransactions,
  //       isPro,
  //     });
  //   } catch (error) {
  //     console.error('Error getting customer info:', error);
  //     set({ loading: false });
  //   }
  // },
}));

export default useSubs;
