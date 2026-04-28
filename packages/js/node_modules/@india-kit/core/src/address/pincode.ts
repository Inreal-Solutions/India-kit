const SAMPLE_PINCODES: Record<string, {district:string,state:string}> = {
  '110001': { district: 'New Delhi', state: 'Delhi' },
  '560001': { district: 'Bangalore Urban', state: 'Karnataka' },
  '400001': { district: 'Mumbai', state: 'Maharashtra' }
};

export function validatePincode(pin: string): { valid: boolean; reason?: string } {
  if (!pin) return { valid: false, reason: 'empty' };
  const s = pin.trim();
  if (!/^[1-9][0-9]{5}$/.test(s)) return { valid: false, reason: 'format' };
  return { valid: true };
}

export function lookupPincode(pin: string) {
  const key = pin.trim();
  return SAMPLE_PINCODES[key] || null;
}
