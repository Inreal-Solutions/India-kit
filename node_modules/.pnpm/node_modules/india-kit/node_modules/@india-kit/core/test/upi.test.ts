import { describe, it, expect } from 'vitest';
import { validateUPI } from '../src/banking/upi';

describe('UPI VPA validation', () => {
  it('accepts valid vpAs', () => {
    expect(validateUPI('alice@icici').valid).toBe(true);
    expect(validateUPI('bob.smith@upi').valid).toBe(true);
  });

  it('rejects bad vpAs', () => {
    expect(validateUPI('not-an-upi').valid).toBe(false);
    expect(validateUPI('').valid).toBe(false);
  });
});
