// Minimal GSTIN validator: 15 chars, includes PAN at positions 3-12
export function validateGSTIN(gstin: string): { valid: boolean; reason?: string } {
  if (!gstin) return { valid: false, reason: 'empty' };
  const g = gstin.trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(g)) {
    return { valid: false, reason: 'format' };
  }
  // basic PAN embedded check (positions 2..11)
  const pan = g.slice(2,12);
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return { valid: false, reason: 'pan' };
  return { valid: true };
}

export function mockGSTIN(): string {
  // 2 digits state + PAN + entity + Z + checksum (simple random)
  const state = String(Math.floor(10 + Math.random()*89));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rand = (n:number)=>Math.floor(Math.random()*n);
  const pan = Array.from({length:5},()=>letters[rand(letters.length)]).join('') + String(Math.floor(1000+Math.random()*9000)) + letters[rand(letters.length)];
  const entity = String(Math.floor(1 + Math.random()*9));
  const checksum = 'A';
  return `${state}${pan}${entity}Z${checksum}`;
}
