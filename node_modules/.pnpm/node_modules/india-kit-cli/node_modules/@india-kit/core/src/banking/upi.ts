export function validateUPI(vpa: string): { valid: boolean; reason?: string } {
  if (!vpa) return { valid: false, reason: 'empty' };
  const s = vpa.trim();
  // simple check: localpart@domain, domain alpha
  const m = s.match(/^([a-zA-Z0-9._%+-]{2,})@([a-zA-Z]{2,})$/);
  if (!m) return { valid: false, reason: 'format' };
  return { valid: true };
}
