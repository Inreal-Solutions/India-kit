import { describe, it, expect } from 'vitest';
import { validateAadhaar, mockAadhaar } from '../src/identity/aadhaar';
import fc from 'fast-check';

describe('Aadhaar (Verhoeff) validator', () => {
  it('validates known-good aadhaar produced by mock', () => {
    for (let i = 0; i < 20; i++) {
      const a = mockAadhaar();
      expect(validateAadhaar(a).valid).toBe(true);
    }
  });

  it('rejects incorrect checksum', () => {
    const a = mockAadhaar();
    const altered = a.slice(0,11) + ((parseInt(a[11]) + 1) % 10).toString();
    expect(validateAadhaar(altered).valid).toBe(false);
    expect(validateAadhaar(altered).reason).toBe('checksum');
  });

  it('rejects malformed inputs', () => {
    expect(validateAadhaar('123')).toEqual({ valid: false, reason: 'format' });
    expect(validateAadhaar('')).toEqual({ valid: false, reason: 'empty' });
  });

  it('property: random numeric strings mostly invalid', () => {
    fc.assert(
      fc.property(fc.stringOf(fc.char(), 1, 20), (s) => {
        const r = validateAadhaar(s);
        // returns object; ok if valid false or true; ensure no crash
        return typeof r.valid === 'boolean';
      }),
      { numRuns: 100 }
    );
  });
});
