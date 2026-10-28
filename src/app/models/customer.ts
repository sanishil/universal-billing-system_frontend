export type CustomerAccountStatus = 'NONE' | 'INVITED' | 'REGISTERED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  /** The creator's business this customer is billed from */
  businessId?: string;
  gstin?: string;
  pan?: string;
  state?: string;
  stateCode?: string;
  totalSpent?: number;
  billsCount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  /** Whether this customer has a login of their own */
  accountStatus?: CustomerAccountStatus;
}
