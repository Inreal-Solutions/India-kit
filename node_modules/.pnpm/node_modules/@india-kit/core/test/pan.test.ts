import { describe, it, expect } from 'vitest';
import { validatePAN, mockPAN, maskPAN } from '../src/identity/pan';
import fc from 'fast-check';

describe('PAN validator', () => {
  it('accepts valid sample PANs', () => {
    expect(validatePAN('ABCDE1234F').valid).toBe(true);
    expect(validatePAN('aaaaa1234a').valid).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(validatePAN('ABC1234F').valid).toBe(false);
    expect(validatePAN('')).toEqual({ valid: false, reason: 'empty' });
  });

  it('mockPAN produces valid PANs (property)', () => {
    fc.assert(
      fc.property(fc.integer(0, 1000), () => {
        const p = mockPAN();
        return validatePAN(p).valid === true;
      }),
      { numRuns: 50 }
    );
  });

  it('maskPAN masks middle characters', () => {
    const p = 'ABCDE1234F';
    expect(maskPAN(p)).toBe('ABCXX1234F');
  });

  it('rejects lowercase malformed PANs', () => {
    expect(validatePAN('abcde12345')).toEqual({ valid: false, reason: 'format' });
  });
});
