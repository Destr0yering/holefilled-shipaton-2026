export interface EntitlementState {
  active: boolean;
  mode: 'native' | 'web-demo';
  entitlementId: string;
  configured: boolean;
}

export interface PaywallOffering {
  packageId: string;
  productTitle: string;
  priceString: string;
}

export interface RevenueCatService {
  configure(appUserId?: string): Promise<void>;
  getEntitlement(): Promise<EntitlementState>;
  getOffering(): Promise<PaywallOffering | null>;
  purchase(): Promise<EntitlementState>;
  restore(): Promise<EntitlementState>;
}
