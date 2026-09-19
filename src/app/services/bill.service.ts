import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../models/bill';
import { numberToIndianWords } from '../shared/utils/currency-utils';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private initialBills: Bill[] = [
    {
      id: 'INV-2026-001',
      customerId: 'CUST-001',
      customerName: 'Infosys Digital Systems Ltd.',
      customerGstin: '29AAACI4321A1ZG',
      supplierGstin: '29AABCU9603R1ZM',
      pan: 'AAACI4321A',
      placeOfSupply: 'Karnataka (29)',
      stateCode: '29',
      isInterState: false,
      gstRate: 18,
      items: [
        { id: 'item-1', name: 'Enterprise Cloud Infrastructure & Kubernetes', hsnSac: '998315', quantity: 1, price: 85000 },
        { id: 'item-2', name: 'Dedicated Support & 24/7 SLA Retainer', hsnSac: '998314', quantity: 1, price: 45000 },
        { id: 'item-3', name: 'Security Cert Audit & Vulnerability Assessment', hsnSac: '998316', quantity: 2, price: 12500 }
      ],
      subtotal: 155000,
      cgst: 13950,
      sgst: 13950,
      igst: 0,
      tax: 27900,
      total: 182900,
      amountInWords: numberToIndianWords(182900),
      currency: 'INR',
      status: 'PAID',
      uniqueLink: 'bill-infosys-2026001',
      createdAt: '2026-09-10',
      dueDate: '2026-09-24',
      notes: 'Payment settled via Net Banking (SBI Corporate). Thank you for your partnership!'
    },
    {
      id: 'INV-2026-002',
      customerId: 'CUST-002',
      customerName: 'Tata Tech Solutions Pvt. Ltd.',
      customerGstin: '27AAACT2941E1ZY',
      supplierGstin: '29AABCU9603R1ZM',
      pan: 'AAACT2941E',
      placeOfSupply: 'Maharashtra (27)',
      stateCode: '27',
      isInterState: true,
      gstRate: 18,
      items: [
        { id: 'item-4', name: 'UI/UX Brand Design Tokens & System Engineering', hsnSac: '998314', quantity: 1, price: 120000 },
        { id: 'item-5', name: 'Frontend Angular Integration & Consulting', hsnSac: '998313', quantity: 12, price: 7500 }
      ],
      subtotal: 210000,
      cgst: 0,
      sgst: 0,
      igst: 37800,
      tax: 37800,
      total: 247800,
      amountInWords: numberToIndianWords(247800),
      currency: 'INR',
      status: 'PENDING',
      uniqueLink: 'bill-tatatech-2026002',
      createdAt: '2026-09-12',
      dueDate: '2026-09-26',
      notes: 'Payment terms: 14 days. Please settle via UPI or NEFT to A/C #50200088921102 (IFSC: HDFC0000128).'
    },
    {
      id: 'INV-2026-003',
      customerId: 'CUST-003',
      customerName: 'Reliance Enterprise Cloud Solutions',
      customerGstin: '27AABCR1234N1ZT',
      supplierGstin: '29AABCU9603R1ZM',
      pan: 'AABCR1234N',
      placeOfSupply: 'Maharashtra (27)',
      stateCode: '27',
      isInterState: true,
      gstRate: 18,
      items: [
        { id: 'item-6', name: 'Big Data Pipeline Architecture & Kafka Cluster', hsnSac: '998315', quantity: 1, price: 280000 },
        { id: 'item-7', name: 'Real-time Telemetry Dashboard Implementation', hsnSac: '998314', quantity: 1, price: 95000 }
      ],
      subtotal: 375000,
      cgst: 0,
      sgst: 0,
      igst: 67500,
      tax: 67500,
      total: 442500,
      amountInWords: numberToIndianWords(442500),
      currency: 'INR',
      status: 'OVERDUE',
      uniqueLink: 'bill-reliance-2026003',
      createdAt: '2026-08-20',
      dueDate: '2026-09-05',
      notes: 'Reminder: This Tax Invoice is past due date. Please initiate immediate settlement via RTGS/NEFT.'
    },
    {
      id: 'INV-2026-004',
      customerId: 'CUST-004',
      customerName: 'Zomato Commerce Logistics India',
      customerGstin: '06AADCB7654C1ZF',
      supplierGstin: '29AABCU9603R1ZM',
      pan: 'AADCB7654C',
      placeOfSupply: 'Haryana (06)',
      stateCode: '06',
      isInterState: true,
      gstRate: 18,
      items: [
        { id: 'item-8', name: 'Payment Gateway Security & Compliance Review', hsnSac: '998314', quantity: 1, price: 190000 },
        { id: 'item-9', name: 'OAuth2 & Multi-Factor Auth Microservice', hsnSac: '998314', quantity: 1, price: 80000 }
      ],
      subtotal: 270000,
      cgst: 0,
      sgst: 0,
      igst: 48600,
      tax: 48600,
      total: 318600,
      amountInWords: numberToIndianWords(318600),
      currency: 'INR',
      status: 'PAID',
      uniqueLink: 'bill-zomato-2026004',
      createdAt: '2026-09-02',
      dueDate: '2026-09-16',
      notes: 'Cleared via RuPay Corporate Banking / UPI Ref: 32091482019.'
    },
    {
      id: 'INV-2026-005',
      customerId: 'CUST-005',
      customerName: 'Bengaluru Tech Labs & Media',
      customerGstin: '29AACB09876K1ZQ',
      supplierGstin: '29AABCU9603R1ZM',
      pan: 'AACB09876K',
      placeOfSupply: 'Karnataka (29)',
      stateCode: '29',
      isInterState: false,
      gstRate: 18,
      items: [
        { id: 'item-10', name: 'CDN Edge Optimization & Video Delivery', hsnSac: '998315', quantity: 1, price: 65000 },
        { id: 'item-11', name: 'High Efficiency Transcoding Infrastructure', hsnSac: '998314', quantity: 6, price: 8000 }
      ],
      subtotal: 113000,
      cgst: 10170,
      sgst: 10170,
      igst: 0,
      tax: 20340,
      total: 133340,
      amountInWords: numberToIndianWords(133340),
      currency: 'INR',
      status: 'PENDING',
      uniqueLink: 'bill-blrlabs-2026005',
      createdAt: '2026-09-15',
      dueDate: '2026-09-29',
      notes: 'Pending finance sign-off from accounts department.'
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
    const uniqueSuffix = Date.now().toString().slice(-6);
    const newId = `INV-2026-${uniqueSuffix}`;
    const uniqueLink = `bill-${(billData.customerName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}-${uniqueSuffix}`;

    const items = billData.items || [];
    const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    const gstRate = billData.gstRate !== undefined ? billData.gstRate : 18;
    const isInterState = billData.isInterState !== undefined ? billData.isInterState : false;
    
    const tax = billData.tax !== undefined ? billData.tax : Math.round(subtotal * (gstRate / 100) * 100) / 100;
    const cgst = isInterState ? 0 : Math.round(tax / 2 * 100) / 100;
    const sgst = isInterState ? 0 : Math.round(tax / 2 * 100) / 100;
    const igst = isInterState ? tax : 0;
    const total = subtotal + tax;

    const newBill: Bill = {
      id: newId,
      customerId: billData.customerId || 'CUST-001',
      customerName: billData.customerName || 'General Customer',
      customerGstin: billData.customerGstin || '29AAAAA0000A1Z5',
      supplierGstin: '29AABCU9603R1ZM',
      pan: billData.pan || 'AAAAA0000A',
      placeOfSupply: billData.placeOfSupply || 'Karnataka (29)',
      stateCode: billData.stateCode || '29',
      isInterState,
      gstRate,
      cgst,
      sgst,
      igst,
      items: items.map((it, idx) => ({
        ...it,
        id: it.id || `item-${Date.now()}-${idx}`,
        hsnSac: it.hsnSac || '998314'
      })),
      subtotal,
      tax,
      total,
      amountInWords: numberToIndianWords(total),
      currency: 'INR',
      status: billData.status || 'PENDING',
      uniqueLink,
      createdAt: billData.createdAt || new Date().toISOString().split('T')[0],
      dueDate: billData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: billData.notes || 'Thank you for choosing Universal Billing System. Payment via UPI or Net Banking appreciated.'
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
    const gstRate = updatedData.gstRate !== undefined ? updatedData.gstRate : (existing.gstRate || 18);
    const isInterState = updatedData.isInterState !== undefined ? updatedData.isInterState : (existing.isInterState || false);
    const tax = updatedData.tax !== undefined ? updatedData.tax : Math.round(subtotal * (gstRate / 100) * 100) / 100;
    const cgst = isInterState ? 0 : Math.round(tax / 2 * 100) / 100;
    const sgst = isInterState ? 0 : Math.round(tax / 2 * 100) / 100;
    const igst = isInterState ? tax : 0;
    const total = subtotal + tax;

    const merged: Bill = {
      ...existing,
      ...updatedData,
      items,
      subtotal,
      gstRate,
      cgst,
      sgst,
      igst,
      isInterState,
      tax,
      total,
      amountInWords: numberToIndianWords(total)
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
