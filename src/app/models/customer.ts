export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  totalSpent?: number;
  billsCount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}
