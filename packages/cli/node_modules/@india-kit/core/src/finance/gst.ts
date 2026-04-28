export function splitGST(amount: number, ratePercent: number, intraState = true) {
  const rate = ratePercent / 100;
  const tax = +(amount * rate).toFixed(2);
  if (intraState) {
    const half = +(tax / 2).toFixed(2);
    return { cgst: half, sgst: +(tax - half).toFixed(2), igst: 0, totalTax: tax };
  }
  return { cgst: 0, sgst: 0, igst: tax, totalTax: tax };
}
