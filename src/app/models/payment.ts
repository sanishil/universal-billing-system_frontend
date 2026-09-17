export interface Payment {
  id: string;
  billId: string;
  customerName?: string;
  amount: number;
  method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId: string;
  date: string;
}
