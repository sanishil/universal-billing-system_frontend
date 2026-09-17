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
      customerName: 'Acme Global Technologies',
      amount: 3080,
      method: 'BANK_TRANSFER',
      status: 'SUCCESS',
      transactionId: 'TXN-WIRE-884219',
      date: '2026-09-14 11:24 AM'
    },
    {
      id: 'PAY-8920',
      billId: 'INV-2026-004',
      customerName: 'Nexus Fintech Corp',
      amount: 4950,
      method: 'CREDIT_CARD',
      status: 'SUCCESS',
      transactionId: 'TXN-CARD-991204',
      date: '2026-09-08 04:45 PM'
    },
    {
      id: 'PAY-8919',
      billId: 'INV-2026-002',
      customerName: 'Starlight Design Studio',
      amount: 2100,
      method: 'PAYPAL',
      status: 'PENDING',
      transactionId: 'TXN-PP-332910',
      date: '2026-09-15 02:15 PM'
    },
    {
      id: 'PAY-8918',
      billId: 'INV-2026-003',
      customerName: 'Apex Data Logistics',
      amount: 5995,
      method: 'CREDIT_CARD',
      status: 'FAILED',
      transactionId: 'TXN-ERR-110943',
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
    const txnId = `TXN-${(paymentData.method || 'ONLINE').slice(0, 4)}-${Date.now().toString().slice(-6)}`;

    const newPayment: Payment = {
      id: newId,
      billId: paymentData.billId || 'INV-2026-002',
      customerName: paymentData.customerName || 'Direct Payment Client',
      amount: paymentData.amount || 100,
      method: paymentData.method || 'CREDIT_CARD',
      status: 'SUCCESS',
      transactionId: txnId,
      date: new Date().toLocaleDateString('en-US', {
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
