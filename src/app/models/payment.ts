export interface Payment {
  id: string;
  billId: string;
  customerName?: string;
  amount: number;
  currency?: string;
  method: 'UPI' | 'NET_BANKING' | 'RUPAY_CARD' | 'NEFT_RTGS' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
  upiId?: string;
  bankName?: string;
  utrNumber?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId: string;
  date: string;
}
