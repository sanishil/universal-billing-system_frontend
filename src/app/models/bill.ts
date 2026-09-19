export interface BillItem {
  id?: string;
  name: string;
  hsnSac?: string;
  quantity: number;
  price: number;
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
  gstRate?: number;
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
}
