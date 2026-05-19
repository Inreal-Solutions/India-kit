import {
  validatePAN, maskPAN, mockPAN,
  validateAadhaar, mockAadhaar,
  validateGSTIN, mockGSTIN,
  validateIFSC, lookupIFSC,
  validateUPI,
  validatePincode, lookupPincode,
  splitGST,
} from './index';

const VERSION = '0.1.1';

const HELP = `
india-kit v${VERSION} — The Definitive Indian Dev Toolkit

USAGE
  india-kit validate <type> <value>
  india-kit mock <type>
  india-kit gst <amount> <rate%> [--inter]
  india-kit --help | --version

VALIDATE TYPES
  pan       Permanent Account Number
  aadhaar   Aadhaar (12-digit, Verhoeff checksum)
  gstin     GST Identification Number
  ifsc      Indian Financial System Code
  upi       UPI Virtual Payment Address
  pincode   6-digit PIN code

MOCK TYPES
  pan       Generate a random valid PAN
  aadhaar   Generate a random valid Aadhaar
  gstin     Generate a random valid GSTIN

EXAMPLES
  india-kit validate pan ABCDE1234F
  india-kit validate aadhaar 234123412346
  india-kit validate ifsc SBIN0000001
  india-kit mock pan
  india-kit mock aadhaar
  india-kit gst 1000 18
  india-kit gst 1000 18 --inter
`.trim();

function ok(msg: string) {
  process.stdout.write(`✔  ${msg}\n`);
}
function fail(msg: string) {
  process.stderr.write(`✘  ${msg}\n`);
  process.exit(2);
}
function info(msg: string) {
  process.stdout.write(`${msg}\n`);
}

const [, , cmd, ...rest] = process.argv;

if (!cmd || cmd === '--help' || cmd === '-h') {
  info(HELP);
  process.exit(0);
}

if (cmd === '--version' || cmd === '-v') {
  info(VERSION);
  process.exit(0);
}

if (cmd === 'validate') {
  const [type, value] = rest;
  if (!type || !value) {
    fail('Usage: india-kit validate <type> <value>');
  }
  const t = type.toLowerCase();
  let result: { valid: boolean; reason?: string };

  if (t === 'pan')         result = validatePAN(value);
  else if (t === 'aadhaar') result = validateAadhaar(value);
  else if (t === 'gstin')   result = validateGSTIN(value);
  else if (t === 'ifsc') {
    result = validateIFSC(value);
    if (result.valid) {
      const meta = lookupIFSC(value);
      if (meta) ok(`${value} is valid — ${meta.bank}, ${meta.branch}${meta.city ? ', ' + meta.city : ''}`);
      else ok(`${value} is valid`);
      process.exit(0);
    }
  }
  else if (t === 'upi')     result = validateUPI(value);
  else if (t === 'pincode') {
    result = validatePincode(value);
    if (result.valid) {
      const meta = lookupPincode(value);
      if (meta) ok(`${value} is valid — ${meta.district}, ${meta.state}`);
      else ok(`${value} is valid`);
      process.exit(0);
    }
  }
  else fail(`Unknown type "${type}". Use: pan, aadhaar, gstin, ifsc, upi, pincode`);

  if (result!.valid) ok(`${value} is valid`);
  else fail(`${value} is invalid — ${result!.reason}`);
}

else if (cmd === 'mock') {
  const [type] = rest;
  if (!type) fail('Usage: india-kit mock <type>');
  const t = type.toLowerCase();
  if (t === 'pan')          info(mockPAN());
  else if (t === 'aadhaar') info(mockAadhaar());
  else if (t === 'gstin')   info(mockGSTIN());
  else fail(`Unknown type "${type}". Use: pan, aadhaar, gstin`);
}

else if (cmd === 'gst') {
  const [amountStr, rateStr] = rest;
  const interFlag = rest.includes('--inter');
  if (!amountStr || !rateStr) fail('Usage: india-kit gst <amount> <rate%> [--inter]');
  const amount = parseFloat(amountStr);
  const rate = parseFloat(rateStr);
  if (isNaN(amount) || isNaN(rate)) fail('amount and rate must be numbers');
  const result = splitGST(amount, rate, !interFlag);
  if (!interFlag) {
    info(`Amount : ₹${amount}`);
    info(`Rate   : ${rate}%`);
    info(`CGST   : ₹${result.cgst}`);
    info(`SGST   : ₹${result.sgst}`);
    info(`Total  : ₹${result.totalTax}`);
  } else {
    info(`Amount : ₹${amount}`);
    info(`Rate   : ${rate}%`);
    info(`IGST   : ₹${result.igst}`);
    info(`Total  : ₹${result.totalTax}`);
  }
}

else {
  fail(`Unknown command "${cmd}". Run india-kit --help`);
}
