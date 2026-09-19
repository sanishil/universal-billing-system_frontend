export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  gstin?: string;
  pan?: string;
  state?: string;
  stateCode?: string;
  totalSpent?: number;
  billsCount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}
