import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private initialBills: Bill[] = [
    {
      id: 'INV-2026-001',
      customerId: 'CUST-001',
      customerName: 'Acme Global Technologies',
      items: [
        { id: 'item-1', name: 'Enterprise Cloud Infrastructure Hosting', quantity: 1, price: 1850 },
        { id: 'item-2', name: 'Dedicated Support & Maintenance Retainer', quantity: 1, price: 650 },
        { id: 'item-3', name: 'SSL Security Cert & Audit', quantity: 2, price: 150 }
      ],
      subtotal: 2800,
      tax: 280,
      total: 3080,
      status: 'PAID',
      uniqueLink: 'bill-acme-2026001',
      createdAt: '2026-09-10',
      dueDate: '2026-09-24',
      notes: 'Payment received via Bank Wire. Thank you for your business!'
    },
    {
      id: 'INV-2026-002',
      customerId: 'CUST-002',
      customerName: 'Starlight Design Studio',
      items: [
        { id: 'item-4', name: 'UI/UX Brand Guidelines & Design Tokens', quantity: 1, price: 2400 },
        { id: 'item-5', name: 'Frontend Angular Integration Consulting', quantity: 15, price: 95 }
      ],
      subtotal: 3825,
      tax: 382.5,
      total: 4207.5,
      status: 'PENDING',
      uniqueLink: 'bill-starlight-2026002',
      createdAt: '2026-09-12',
      dueDate: '2026-09-26',
      notes: 'Standard 14 days payment window. Please wire to Account #7829-UB.'
    },
    {
      id: 'INV-2026-003',
      customerId: 'CUST-003',
      customerName: 'Apex Data Logistics',
      items: [
        { id: 'item-6', name: 'Big Data Pipeline Architecture Sprint', quantity: 1, price: 4200 },
        { id: 'item-7', name: 'Telemetry Dashboard Implementation', quantity: 1, price: 1250 }
      ],
      subtotal: 5450,
      tax: 545,
      total: 5995,
      status: 'OVERDUE',
      uniqueLink: 'bill-apex-2026003',
      createdAt: '2026-08-20',
      dueDate: '2026-09-05',
      notes: 'Notice: This invoice is overdue. Kindly settle immediately.'
    },
    {
      id: 'INV-2026-004',
      customerId: 'CUST-004',
      customerName: 'Nexus Fintech Corp',
      items: [
        { id: 'item-8', name: 'Payment Gateway Security Compliance', quantity: 1, price: 3100 },
        { id: 'item-9', name: 'OAuth2 & Multi-Factor Auth Module', quantity: 1, price: 1400 }
      ],
      subtotal: 4500,
      tax: 450,
      total: 4950,
      status: 'PAID',
      uniqueLink: 'bill-nexus-2026004',
      createdAt: '2026-09-02',
      dueDate: '2026-09-16',
      notes: 'Settled via Corporate Visa card ending 4019.'
    },
    {
      id: 'INV-2026-005',
      customerId: 'CUST-005',
      customerName: 'Horizon Media Ventures',
      items: [
        { id: 'item-10', name: 'Content Delivery Network Optimization', quantity: 1, price: 1200 },
        { id: 'item-11', name: 'Asset Video Encoding Services', quantity: 8, price: 75 }
      ],
      subtotal: 1800,
      tax: 180,
      total: 1980,
      status: 'PENDING',
      uniqueLink: 'bill-horizon-2026005',
      createdAt: '2026-09-15',
      dueDate: '2026-09-29',
      notes: 'Pending customer finance sign-off.'
    }
  ];

  private billsSubject = new BehaviorSubject<Bill[]>(this.initialBills);
  public bills$ = this.billsSubject.asObservable();

  getBills(): Observable<Bill[]> {
    return of(this.billsSubject.value);
  }

  getBillById(id: string): Observable<Bill | undefined> {
    const bill = this.billsSubject.value.find(b => b.id === id);
    return of(bill);
  }

  getBillByUniqueLink(uniqueLink: string): Observable<Bill | undefined> {
    const bill = this.billsSubject.value.find(b => b.uniqueLink === uniqueLink);
    return of(bill);
  }

  createBill(billData: Partial<Bill>): Observable<Bill> {
    const currentBills = this.billsSubject.value;
    const nextNum = currentBills.length + 1;
    const newId = `INV-2026-${String(nextNum).padStart(3, '0')}`;
    const uniqueLink = `bill-${(billData.customerName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;

    const items = billData.items || [];
    const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    const tax = billData.tax !== undefined ? billData.tax : Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const newBill: Bill = {
      id: newId,
      customerId: billData.customerId || 'CUST-001',
      customerName: billData.customerName || 'General Customer',
      items: items.map((it, idx) => ({ ...it, id: it.id || `item-${Date.now()}-${idx}` })),
      subtotal,
      tax,
      total,
      status: billData.status || 'PENDING',
      uniqueLink,
      createdAt: billData.createdAt || new Date().toISOString().split('T')[0],
      dueDate: billData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: billData.notes || 'Thank you for choosing Universal Billing System.'
    };

    const updated = [newBill, ...currentBills];
    this.billsSubject.next(updated);
    return of(newBill);
  }

  updateBill(id: string, updatedData: Partial<Bill>): Observable<Bill | null> {
    const currentBills = this.billsSubject.value;
    const index = currentBills.findIndex(b => b.id === id);
    if (index === -1) return of(null);

    const existing = currentBills[index];
    const items = updatedData.items || existing.items;
    const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    const tax = updatedData.tax !== undefined ? updatedData.tax : Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const merged: Bill = {
      ...existing,
      ...updatedData,
      items,
      subtotal,
      tax,
      total
    };

    const updatedList = [...currentBills];
    updatedList[index] = merged;
    this.billsSubject.next(updatedList);
    return of(merged);
  }

  deleteBill(id: string): Observable<boolean> {
    const currentBills = this.billsSubject.value;
    const filtered = currentBills.filter(b => b.id !== id);
    this.billsSubject.next(filtered);
    return of(true);
  }

  markAsPaid(id: string): Observable<Bill | null> {
    return this.updateBill(id, { status: 'PAID' });
  }

  getStats(): Observable<{ totalRevenue: number; paidCount: number; pendingCount: number; overdueCount: number; totalCount: number }> {
    return this.bills$.pipe(
      map(bills => {
        const totalRevenue = bills
          .filter(b => b.status === 'PAID')
          .reduce((sum, b) => sum + b.total, 0);
        const paidCount = bills.filter(b => b.status === 'PAID').length;
        const pendingCount = bills.filter(b => b.status === 'PENDING').length;
        const overdueCount = bills.filter(b => b.status === 'OVERDUE').length;
        return {
          totalRevenue,
          paidCount,
          pendingCount,
          overdueCount,
          totalCount: bills.length
        };
      })
    );
  }
}
