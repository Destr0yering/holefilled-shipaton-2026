import { EntitlementState, RevenueCatService } from './revenuecat';

let active = false;
const state = (): EntitlementState => ({ active, mode: 'web-demo', entitlementId: 'holefilled_pro', configured: true });

export const revenueCat: RevenueCatService = {
  async configure() {},
  async getEntitlement() { return state(); },
  async getOffering() { return { packageId: 'web-demo-monthly', productTitle: 'HoleFilled Pro', priceString: '$49.00' }; },
  async purchase() { active = true; return state(); },
  async restore() { return state(); },
};
