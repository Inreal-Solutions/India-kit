import { describe, it, expect } from 'vitest';
import { validateIFSC, lookupIFSC } from '../src/banking/ifsc';

describe('IFSC validator and lookup', () => {
  it('validates correct IFSC formats', () => {
    expect(validateIFSC('SBIN0000001').valid).toBe(true);
    expect(validateIFSC('HDFC0000002').valid).toBe(true);
  });

  it('rejects incorrect IFSCs', () => {
    expect(validateIFSC('SBI000001').valid).toBe(false);
    expect(validateIFSC('').valid).toBe(false);
  });

  it('lookup returns metadata for sample IFSC', () => {
    const r = lookupIFSC('SBIN0000001');
    expect(r).toHaveProperty('bank');
    expect(r!.bank).toContain('State Bank');
  });
});
