import { describe, it, expect } from 'vitest';
import { validatePincode, lookupPincode } from '../src/address/pincode';

describe('Pincode validation and lookup', () => {
  it('validates known pincodes', () => {
    expect(validatePincode('110001').valid).toBe(true);
    expect(validatePincode('560001').valid).toBe(true);
  });

  it('rejects bad pincodes', () => {
    expect(validatePincode('012345').valid).toBe(false);
    expect(validatePincode('abc').valid).toBe(false);
  });

  it('lookup returns metadata', () => {
    const r = lookupPincode('110001');
    expect(r).toHaveProperty('state');
  });
});
