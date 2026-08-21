import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';
import { EntitlementState, PaywallOffering, RevenueCatService } from './revenuecat';

const entitlementId = 'holefilled_pro';
let configured = false;

const platformApiKey = () => Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
});

const mapState = async (): Promise<EntitlementState> => {
  const info = await Purchases.getCustomerInfo();
  return { active: Boolean(info.entitlements.active[entitlementId]), mode: 'native', entitlementId, configured };
};

const currentPackage = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages[0] ?? null;
};

export const revenueCat: RevenueCatService = {
  async configure(appUserId) {
    const apiKey = platformApiKey();
    if (!apiKey || configured) return;
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
    Purchases.configure(appUserId ? { apiKey, appUserID: appUserId } : { apiKey });
    configured = true;
  },
  async getEntitlement() {
    if (!configured) return { active: false, mode: 'native', entitlementId, configured };
    return mapState();
  },
  async getOffering(): Promise<PaywallOffering | null> {
    if (!configured) return null;
    const selected = await currentPackage();
    if (!selected) return null;
    return {
      packageId: selected.identifier,
      productTitle: selected.product.title,
      priceString: selected.product.priceString,
    };
  },
  async purchase() {
    if (!configured) throw new Error('RevenueCat is not configured for this platform.');
    const selected = await currentPackage();
    if (!selected) throw new Error('No RevenueCat package is configured.');
    await Purchases.purchasePackage(selected);
    return mapState();
  },
  async restore() {
    if (!configured) throw new Error('RevenueCat is not configured for this platform.');
    await Purchases.restorePurchases();
    return mapState();
  },
};
