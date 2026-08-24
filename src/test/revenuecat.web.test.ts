import { describe, expect, it } from 'vitest';
import { revenueCat } from '../services/revenuecat.web';

describe('RevenueCat web preview adapter', () => {
  it('provides an offering and maintains the demo entitlement through purchase and restore', async () => {
    await revenueCat.configure();

    const before = await revenueCat.getEntitlement();
    const offering = await revenueCat.getOffering();

    expect(before).toMatchObject({ active: false, mode: 'web-demo', entitlementId: 'holefilled_pro', configured: true });
    expect(offering).toEqual({ packageId: 'web-demo-monthly', productTitle: 'HoleFilled Pro', priceString: '$49.00' });

    const purchased = await revenueCat.purchase();
    const restored = await revenueCat.restore();

    expect(purchased.active).toBe(true);
    expect(restored).toMatchObject({ active: true, mode: 'web-demo', configured: true });
  });
});
