export interface BillItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  uniqueLink: string;
  createdAt: string;
  dueDate: string;
  notes?: string;
}
