"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  lookupIFSC: () => lookupIFSC,
  lookupPincode: () => lookupPincode,
  maskPAN: () => maskPAN,
  mockAadhaar: () => mockAadhaar,
  mockGSTIN: () => mockGSTIN,
  mockPAN: () => mockPAN,
  splitGST: () => splitGST,
  validateAadhaar: () => validateAadhaar,
  validateGSTIN: () => validateGSTIN,
  validateIFSC: () => validateIFSC,
  validatePAN: () => validatePAN,
  validatePincode: () => validatePincode,
  validateUPI: () => validateUPI
});
module.exports = __toCommonJS(src_exports);

// ../core/dist/index.mjs
function validatePAN(pan) {
  if (!pan)
    return { valid: false, reason: "empty" };
  const norm = pan.trim().toUpperCase();
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!re.test(norm))
    return { valid: false, reason: "format" };
  return { valid: true };
}
function maskPAN(pan) {
  const n = pan.trim().toUpperCase();
  if (n.length !== 10)
    return n;
  return `${n.slice(0, 3)}XX${n.slice(5)}`;
}
function mockPAN() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rand = (n) => Math.floor(Math.random() * n);
  const a = Array.from({ length: 5 }, () => letters[rand(letters.length)]).join("");
  const b = String(Math.floor(1e3 + Math.random() * 9e3));
  const c = letters[rand(letters.length)];
  return `${a}${b}${c}`;
}
var verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
var verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];
var verhoeffInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
function verhoeffValidate(num) {
  const digits = num.split("").reverse().map((d) => parseInt(d, 10));
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][digits[i]]];
  }
  return c === 0;
}
function validateAadhaar(a) {
  if (!a)
    return { valid: false, reason: "empty" };
  const norm = a.replace(/\s+/g, "");
  if (!/^\d{12}$/.test(norm))
    return { valid: false, reason: "format" };
  if (!verhoeffValidate(norm))
    return { valid: false, reason: "checksum" };
  return { valid: true };
}
function mockAadhaar() {
  let base = "";
  for (let i = 0; i < 11; i++)
    base += Math.floor(Math.random() * 10).toString();
  const digits = base.split("").reverse().map((d) => parseInt(d, 10));
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[(i + 1) % 8][digits[i]]];
  }
  const check = verhoeffInv[c];
  return base + String(check);
}
function validateGSTIN(gstin) {
  if (!gstin)
    return { valid: false, reason: "empty" };
  const g = gstin.trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(g)) {
    return { valid: false, reason: "format" };
  }
  const pan = g.slice(2, 12);
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))
    return { valid: false, reason: "pan" };
  return { valid: true };
}
function mockGSTIN() {
  const state = String(Math.floor(10 + Math.random() * 89));
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rand = (n) => Math.floor(Math.random() * n);
  const pan = Array.from({ length: 5 }, () => letters[rand(letters.length)]).join("") + String(Math.floor(1e3 + Math.random() * 9e3)) + letters[rand(letters.length)];
  const entity = String(Math.floor(1 + Math.random() * 9));
  const checksum = "A";
  return `${state}${pan}${entity}Z${checksum}`;
}
var SAMPLE_IFSC = {
  "SBIN0000001": { bank: "State Bank of India", branch: "Main", city: "Mumbai" },
  "HDFC0000002": { bank: "HDFC Bank", branch: "MG Road", city: "Bengaluru" }
};
function validateIFSC(ifsc) {
  if (!ifsc)
    return { valid: false, reason: "empty" };
  const f = ifsc.trim().toUpperCase();
  if (!/^[A-Z]{4}0[0-9A-Z]{6}$/.test(f))
    return { valid: false, reason: "format" };
  return { valid: true };
}
function lookupIFSC(ifsc) {
  const key = ifsc.trim().toUpperCase();
  return SAMPLE_IFSC[key] || null;
}
function validateUPI(vpa) {
  if (!vpa)
    return { valid: false, reason: "empty" };
  const s = vpa.trim();
  const m = s.match(/^([a-zA-Z0-9._%+-]{2,})@([a-zA-Z]{2,})$/);
  if (!m)
    return { valid: false, reason: "format" };
  return { valid: true };
}
var SAMPLE_PINCODES = {
  "110001": { district: "New Delhi", state: "Delhi" },
  "560001": { district: "Bangalore Urban", state: "Karnataka" },
  "400001": { district: "Mumbai", state: "Maharashtra" }
};
function validatePincode(pin) {
  if (!pin)
    return { valid: false, reason: "empty" };
  const s = pin.trim();
  if (!/^[1-9][0-9]{5}$/.test(s))
    return { valid: false, reason: "format" };
  return { valid: true };
}
function lookupPincode(pin) {
  const key = pin.trim();
  return SAMPLE_PINCODES[key] || null;
}
function splitGST(amount, ratePercent, intraState = true) {
  const rate = ratePercent / 100;
  const tax = +(amount * rate).toFixed(2);
  if (intraState) {
    const half = +(tax / 2).toFixed(2);
    return { cgst: half, sgst: +(tax - half).toFixed(2), igst: 0, totalTax: tax };
  }
  return { cgst: 0, sgst: 0, igst: tax, totalTax: tax };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lookupIFSC,
  lookupPincode,
  maskPAN,
  mockAadhaar,
  mockGSTIN,
  mockPAN,
  splitGST,
  validateAadhaar,
  validateGSTIN,
  validateIFSC,
  validatePAN,
  validatePincode,
  validateUPI
});
//# sourceMappingURL=index.js.map