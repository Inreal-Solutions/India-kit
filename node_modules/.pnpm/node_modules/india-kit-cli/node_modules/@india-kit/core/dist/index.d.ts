declare function validatePAN(pan: string): {
    valid: boolean;
    reason?: string;
};
declare function maskPAN(pan: string): string;
declare function mockPAN(): string;

declare function validateAadhaar(a: string): {
    valid: boolean;
    reason?: string;
};
declare function mockAadhaar(): string;

declare function validateGSTIN(gstin: string): {
    valid: boolean;
    reason?: string;
};
declare function mockGSTIN(): string;

declare function validateIFSC(ifsc: string): {
    valid: boolean;
    reason?: string;
};
declare function lookupIFSC(ifsc: string): {
    bank: string;
    branch: string;
    city?: string;
};

declare function validateUPI(vpa: string): {
    valid: boolean;
    reason?: string;
};

declare function validatePincode(pin: string): {
    valid: boolean;
    reason?: string;
};
declare function lookupPincode(pin: string): {
    district: string;
    state: string;
};

declare function splitGST(amount: number, ratePercent: number, intraState?: boolean): {
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
};

export { lookupIFSC, lookupPincode, maskPAN, mockAadhaar, mockGSTIN, mockPAN, splitGST, validateAadhaar, validateGSTIN, validateIFSC, validatePAN, validatePincode, validateUPI };
