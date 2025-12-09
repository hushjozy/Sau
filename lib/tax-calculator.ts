// utils/taxHelpers.ts

export interface TaxFormData {
  basicPay: number;
  isBandH: boolean;
  transportAllowance?: number;
  contributingToNHF?: boolean;
  otherAllowances?: number;
  insurancePremium?: number;
  voluntaryPension?: number;
}

export interface TaxResult {
  housing: number;
  leave: number;
  thirteenthMonth: number;
  transportAllowance: number;
  nhf: number;
  pensionablePay: number;
  pension: number;
  grossPay: number;
  adjustedGrossPay: number;
  cra: number;
  totalRelief: number;
  taxablePay: number;
  payeTax: number;
  takeHomePay: number;
}

export function formatCurrency(amount: number): string {
  return "₦" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
// Nigeria PAYE calculator
export function oldCalculatePayeTax(taxablePay: number) {
  const taxBands = [
    { limit: 250000, rate: 0.07 }, // First ₦250k 2025
    { limit: 250000, rate: 0.11 }, // Next ₦250k
    { limit: 500000, rate: 0.15 }, // Next ₦500k
    { limit: 500000, rate: 0.19 }, // Next ₦500k
    { limit: 1600000, rate: 0.21 }, // Next ₦1.6M
    { limit: Infinity, rate: 0.24 }, // Above ₦3.1M
  ];

  let remainingPay = taxablePay;
  let totalTax = 0;

  for (const band of taxBands) {
    if (remainingPay <= 0) break;
    const taxableInBand = Math.min(remainingPay, band.limit);
    totalTax += taxableInBand * band.rate;
    remainingPay -= taxableInBand;
  }

  return totalTax;
}
export function newCalculatePayeTax(taxablePay: number) {
  const taxBands = [
    { limit: 800000, rate: 0.0 }, // First
    { limit: 3000000, rate: 0.15 }, // Next
    { limit: 1200000, rate: 0.18 }, // Next
    { limit: 25000000, rate: 0.21 }, // Next
    { limit: 50000000, rate: 0.23 }, // Next
    { limit: Infinity, rate: 0.25 }, // Above
  ];

  let remainingPay = taxablePay;
  let totalTax = 0;

  for (const band of taxBands) {
    if (remainingPay <= 0) break;
    const taxableInBand = Math.min(remainingPay, band.limit);
    totalTax += taxableInBand * band.rate;
    remainingPay -= taxableInBand;
  }

  return totalTax;
}
export function calculateTax(form: any) {
  const basicPay = parseFloat(form.basicPay) || 0;
  const isBandH = form.isBandH;
  const transportAllowanceInput = parseFloat(form.transportAllowance) || 0;
  const contributingToNHF = form.nhf;
  const otherAllowances = parseFloat(form.otherAllowances) || 0;
  const insurancePremium = parseFloat(form.insurance) || 0;
  const voluntaryPension = parseFloat(form.voluntaryPension) || 0;

  const housing = basicPay * 0.2;
  const leave = basicPay * 0.12;
  const thirteenthMonth = basicPay / 12;

  let transportAllowance = isBandH ? transportAllowanceInput : basicPay * 0.165;

  const nhf = contributingToNHF ? basicPay * 0.025 : 0;

  const pensionablePay = basicPay + housing + transportAllowance;
  const pension = pensionablePay * 0.08;

  let grossPay =
    basicPay +
    housing +
    transportAllowance +
    leave +
    thirteenthMonth +
    otherAllowances;

  const adjustedGrossPay =
    grossPay - pension - nhf - insurancePremium - voluntaryPension;

  const onePercentAGP = adjustedGrossPay * 0.01;
  const monthlyThreshold = 200000 / 12;
  const cra =
    onePercentAGP > monthlyThreshold
      ? onePercentAGP + adjustedGrossPay * 0.2
      : monthlyThreshold + adjustedGrossPay * 0.2;
  const housingRelief = 0.2 * basicPay < 500000 ? 0.2 * basicPay : 500000;
  const totalRelief = cra + insurancePremium + pension + nhf;

  const taxablePay = grossPay - totalRelief;
  const payeTax = oldCalculatePayeTax(taxablePay);

  const newYearTotalRelief = housingRelief + insurancePremium + pension + nhf;

  const newYearTaxablePay = grossPay - newYearTotalRelief;
  const newYearPayeTax = newCalculatePayeTax(newYearTaxablePay);

  return {
    housing,
    leave,
    thirteenthMonth,
    transportAllowance,
    nhf,
    pensionablePay,
    pension,
    grossPay,
    adjustedGrossPay,
    cra,
    totalRelief,
    taxablePay,
    payeTax,
    takeHomePay: grossPay - pension - nhf - payeTax,
    housingRelief,
    newYearTotalRelief,
    newYearTaxablePay,
    newYearPayeTax,
    newTakeHomePay: grossPay - pension - nhf - newYearPayeTax,
  };
}
