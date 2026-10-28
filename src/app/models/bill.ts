export interface BillItem {
  id?: string;
  name: string;
  hsnSac?: string;
  quantity: number;
  price: number;
}

export type BillRole = 'ISSUER' | 'RECIPIENT';
export type BillScope = 'sent' | 'received';

export interface BillParty {
  id: number;
  name: string;
  businessName?: string;
  gstin?: string | null;
  stateCode: string;
  address?: string;
}

export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  customerGstin?: string;
  supplierGstin?: string;
  pan?: string;
  placeOfSupply?: string;
  stateCode?: string;
  items: BillItem[];
  subtotal: number;
  /** null = No GST (Bill of Supply). 0 = nil-rated tax invoice. */
  gstRate?: number | null;
  cgst?: number;
  sgst?: number;
  igst?: number;
  isInterState?: boolean;
  tax: number;
  total: number;
  amountInWords?: string;
  currency?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  uniqueLink: string;
  createdAt: string;
  dueDate: string;
  notes?: string;

  /** Role of the logged-in user on this bill. Older responses omit it; treat missing as ISSUER. */
  myRole?: BillRole;
  issuer?: BillParty;
  /** Issuer's state code, snapshotted when the bill was created */
  supplierStateCode?: string;
  /** Absolute public URL built by the backend */
  publicUrl?: string | null;
  lastEmailStatus?: 'QUEUED' | 'SENT' | 'FAILED' | null;
}

/** Payload for POST /bills and PUT /bills/:id */
export interface BillRequest extends Partial<Bill> {
  sendEmail?: boolean;
  inviteRecipient?: boolean;
}

export interface BillQuery {
  scope?: BillScope;
  status?: 'PAID' | 'PENDING' | 'OVERDUE' | 'UNPAID';
  customerId?: string;
}

export interface ShareLink {
  url: string;
  expiresAt?: string | null;
}

export function isIssuer(bill: Bill): boolean {
  return (bill.myRole ?? 'ISSUER') === 'ISSUER';
}

export function isGstApplied(bill: Pick<Bill, 'gstRate'>): boolean {
  return bill.gstRate !== null;
}
