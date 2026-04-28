import { describe, it, expect } from 'vitest';
import { splitGST } from '../src/finance/gst';

describe('GST split helper', () => {
  it('splits intra-state tax into CGST/SGST', () => {
    const r = splitGST(1000, 18, true);
    expect(r.totalTax).toBeCloseTo(180);
    expect(r.cgst + r.sgst).toBeCloseTo(r.totalTax);
    expect(r.igst).toBe(0);
  });

  it('assigns IGST for interstate', () => {
    const r = splitGST(1000, 18, false);
    expect(r.igst).toBeCloseTo(180);
    expect(r.cgst).toBe(0);
  });

  it('handles zero amount and rates', () => {
    expect(splitGST(0, 18, true).totalTax).toBe(0);
    expect(splitGST(1000, 0, true).totalTax).toBe(0);
  });
});
