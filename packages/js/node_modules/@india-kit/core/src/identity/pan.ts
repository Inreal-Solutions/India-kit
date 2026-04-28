export function validatePAN(pan: string): { valid: boolean; reason?: string } {
  if (!pan) return { valid: false, reason: 'empty' };
  const norm = pan.trim().toUpperCase();
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!re.test(norm)) return { valid: false, reason: 'format' };
  return { valid: true };
}

export function maskPAN(pan: string): string {
  const n = pan.trim().toUpperCase();
  if (n.length !== 10) return n;
  return `${n.slice(0,3)}XX${n.slice(5)}`;
}

export function mockPAN(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rand = (n:number) => Math.floor(Math.random()*n);
  const a = Array.from({length:5},()=>letters[rand(letters.length)]).join('');
  const b = String(Math.floor(1000 + Math.random()*9000));
  const c = letters[rand(letters.length)];
  return `${a}${b}${c}`;
}
