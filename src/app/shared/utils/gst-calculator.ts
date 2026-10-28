/**
 * Single GST calculation used by bill create, edit and the views.
 * The backend recomputes all totals; this is only a live preview and must match GstCalculator.java.
 */

export interface BillLine {
  quantity: number;
  price: number;
}

export interface GstBreakdown {
  subtotal: number;
  gstRate: number | null;   // null = No GST
  interState: boolean;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateGst(
  items: BillLine[],
  gstRate: number | null,
  supplierStateCode: string,       // from the logged-in user's profile
  placeOfSupplyStateCode: string,  // from the customer
): GstBreakdown {
  const subtotal = round2(items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.price || 0), 0));
  const interState = supplierStateCode !== placeOfSupplyStateCode;

  if (gstRate === null) {
    return { subtotal, gstRate: null, interState, cgst: 0, sgst: 0, igst: 0, taxTotal: 0, total: subtotal };
  }

  const tax = round2(subtotal * gstRate / 100);
  const cgst = interState ? 0 : round2(tax / 2);
  const sgst = interState ? 0 : round2(tax - cgst);   // cgst + sgst always equals tax
  const igst = interState ? tax : 0;

  return { subtotal, gstRate, interState, cgst, sgst, igst, taxTotal: tax, total: round2(subtotal + tax) };
}

/** Pulls the 2-digit state code out of "Karnataka (29)" style place-of-supply strings */
export function stateCodeFromPlaceOfSupply(placeOfSupply: string | undefined): string {
  return placeOfSupply?.match(/\((\d{2})\)/)?.[1] ?? '';
}
