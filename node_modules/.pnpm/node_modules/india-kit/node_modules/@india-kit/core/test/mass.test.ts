import { describe, it, expect } from 'vitest';
import { mockPAN, validatePAN } from '../src/identity/pan';
import { mockAadhaar, validateAadhaar } from '../src/identity/aadhaar';
import { mockGSTIN, validateGSTIN } from '../src/identity/gstin';
import { validateIFSC, lookupIFSC } from '../src/banking/ifsc';
import { validateUPI } from '../src/banking/upi';
import { validatePincode, lookupPincode } from '../src/address/pincode';

describe('mass generated test cases (100+)', () => {
  const TOTAL = 120;
  for (let i = 0; i < TOTAL; i++) {
    it(`mass test ${i} - PAN/Aadhaar/GSTIN basic checks`, () => {
      const pan = mockPAN();
      expect(validatePAN(pan).valid).toBe(true);

      const a = mockAadhaar();
      expect(validateAadhaar(a).valid).toBe(true);

      const g = mockGSTIN();
      expect(validateGSTIN(g).valid).toBe(true);

      // IFSC sample
      const ifsc = i % 2 === 0 ? 'SBIN0000001' : 'HDFC0000002';
      expect(validateIFSC(ifsc).valid).toBe(true);
      expect(lookupIFSC(ifsc)).not.toBeNull();

      // UPI random
      expect(validateUPI('test' + i + '@upi').valid).toBe(true);

      // pincode
      const pin = i % 3 === 0 ? '110001' : (i % 3 === 1 ? '560001' : '400001');
      expect(validatePincode(pin).valid).toBe(true);
      expect(lookupPincode(pin)).not.toBeNull();
    });
  }
});
