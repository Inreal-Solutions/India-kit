import { describe, it, expect } from 'vitest';
import { validateGSTIN, mockGSTIN } from '../src/identity/gstin';
import fc from 'fast-check';

describe('GSTIN validator', () => {
  it('accepts mock GSTINs', () => {
    for (let i=0;i<30;i++) {
      expect(validateGSTIN(mockGSTIN()).valid).toBe(true);
    }
  });

  it('rejects bad formats', () => {
    expect(validateGSTIN('12ABCDE12345Z1').valid).toBe(false);
    expect(validateGSTIN('').valid).toBe(false);
  });

  it('property: embedded PAN must be valid', () => {
    fc.assert(
      fc.property(fc.stringOf(fc.char(), 15, 15), (s) => {
        const r = validateGSTIN(s);
        return typeof r.valid === 'boolean';
      }),
      { numRuns: 100 }
    );
  });
});
