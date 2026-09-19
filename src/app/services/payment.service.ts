import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Payment } from '../models/payment';
import { BillService } from './bill.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private billService = inject(BillService);

  private initialPayments: Payment[] = [
    {
      id: 'PAY-8921',
      billId: 'INV-2026-001',
      customerName: 'Infosys Digital Systems Ltd.',
      amount: 182900,
      currency: 'INR',
      method: 'NET_BANKING',
      bankName: 'State Bank of India',
      status: 'SUCCESS',
      transactionId: 'TXN-SBI-884219',
      utrNumber: 'SBIN26257190219',
      date: '2026-09-14 11:24 AM'
    },
    {
      id: 'PAY-8920',
      billId: 'INV-2026-004',
      customerName: 'Zomato Commerce Logistics India',
      amount: 318600,
      currency: 'INR',
      method: 'UPI',
      upiId: 'zomato.finance@okaxis',
      status: 'SUCCESS',
      transactionId: 'TXN-UPI-991204',
      utrNumber: 'UPI425810928114',
      date: '2026-09-08 04:45 PM'
    },
    {
      id: 'PAY-8919',
      billId: 'INV-2026-002',
      customerName: 'Tata Tech Solutions Pvt. Ltd.',
      amount: 125000,
      currency: 'INR',
      method: 'RUPAY_CARD',
      status: 'PENDING',
      transactionId: 'TXN-RUPAY-332910',
      date: '2026-09-15 02:15 PM'
    },
    {
      id: 'PAY-8918',
      billId: 'INV-2026-003',
      customerName: 'Reliance Enterprise Cloud Solutions',
      amount: 442500,
      currency: 'INR',
      method: 'NEFT_RTGS',
      bankName: 'HDFC Bank Corporate',
      status: 'FAILED',
      transactionId: 'TXN-RTGS-110943',
      utrNumber: 'HDFCR520260906001',
      date: '2026-09-06 09:30 AM'
    }
  ];

  private paymentsSubject = new BehaviorSubject<Payment[]>(this.initialPayments);
  public payments$ = this.paymentsSubject.asObservable();

  getPayments(): Observable<Payment[]> {
    return of(this.paymentsSubject.value);
  }

  processPayment(paymentData: Partial<Payment>): Observable<Payment> {
    const current = this.paymentsSubject.value;
    const newId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const methodPrefix = (paymentData.method || 'UPI').replace('_', '').slice(0, 4);
    const txnId = `TXN-${methodPrefix}-${Date.now().toString().slice(-6)}`;
    const utr = `UTR${Date.now().toString().slice(-10)}`;

    const newPayment: Payment = {
      id: newId,
      billId: paymentData.billId || 'INV-2026-002',
      customerName: paymentData.customerName || 'Direct Indian Client',
      amount: paymentData.amount || 5000,
      currency: 'INR',
      method: paymentData.method || 'UPI',
      upiId: paymentData.upiId || (paymentData.method === 'UPI' ? 'client@upi' : undefined),
      bankName: paymentData.bankName,
      status: 'SUCCESS',
      transactionId: txnId,
      utrNumber: utr,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };

    if (paymentData.billId) {
      this.billService.markAsPaid(paymentData.billId).subscribe();
    }

    const updated = [newPayment, ...current];
    this.paymentsSubject.next(updated);
    return of(newPayment);
  }
}
