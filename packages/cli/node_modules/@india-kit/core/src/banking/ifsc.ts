const SAMPLE_IFSC: Record<string, {bank:string,branch:string,city?:string}> = {
  'SBIN0000001': { bank: 'State Bank of India', branch: 'Main', city: 'Mumbai' },
  'HDFC0000002': { bank: 'HDFC Bank', branch: 'MG Road', city: 'Bengaluru' }
};

export function validateIFSC(ifsc: string): { valid: boolean; reason?: string } {
  if (!ifsc) return { valid: false, reason: 'empty' };
  const f = ifsc.trim().toUpperCase();
  if (!/^[A-Z]{4}0[0-9A-Z]{6}$/.test(f)) return { valid: false, reason: 'format' };
  return { valid: true };
}

export function lookupIFSC(ifsc: string) {
  const key = ifsc.trim().toUpperCase();
  return SAMPLE_IFSC[key] || null;
}
