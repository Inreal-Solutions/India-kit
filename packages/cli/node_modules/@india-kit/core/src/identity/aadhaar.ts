// Aadhaar uses the Verhoeff checksum. Implementation below is minimal and offline-only.

const verhoeffD = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];

const verhoeffP = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
];

const verhoeffInv = [0,4,3,2,1,5,6,7,8,9];

function verhoeffValidate(num: string): boolean {
  const digits = num.split('').reverse().map(d=>parseInt(d,10));
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][digits[i]]];
  }
  return c === 0;
}

export function validateAadhaar(a: string): { valid: boolean; reason?: string } {
  if (!a) return { valid: false, reason: 'empty' };
  const norm = a.replace(/\s+/g,'');
  if (!/^\d{12}$/.test(norm)) return { valid: false, reason: 'format' };
  if (!verhoeffValidate(norm)) return { valid: false, reason: 'checksum' };
  return { valid: true };
}

export function mockAadhaar(): string {
  // generate 11 random digits then compute check digit
  let base = '';
  for (let i=0;i<11;i++) base += Math.floor(Math.random()*10).toString();
  // compute check digit via Verhoeff
  const digits = base.split('').reverse().map(d=>parseInt(d,10));
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[(i) % 8][digits[i]]];
  }
  const check = verhoeffInv[c];
  return base + String(check);
}
