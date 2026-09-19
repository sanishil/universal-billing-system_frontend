import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private initialCustomers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'Infosys Digital Systems Ltd.',
      email: 'vendor.billing@infosys-systems.in',
      phone: '+91 80 2852 0261',
      address: 'Electronics City, Hosur Road, Bengaluru, Karnataka 560100',
      company: 'Infosys Systems Enterprise',
      gstin: '29AAACI4321A1ZG',
      pan: 'AAACI4321A',
      state: 'Karnataka',
      stateCode: '29',
      totalSpent: 485000,
      billsCount: 5,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-002',
      name: 'Tata Tech Solutions Pvt. Ltd.',
      email: 'finance@tatatechsolutions.co.in',
      phone: '+91 22 6665 8282',
      address: 'Bombay House, 24 Homi Mody Street, Fort, Mumbai, Maharashtra 400001',
      company: 'Tata Enterprise Group',
      gstin: '27AAACT2941E1ZY',
      pan: 'AAACT2941E',
      state: 'Maharashtra',
      stateCode: '27',
      totalSpent: 342000,
      billsCount: 3,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-003',
      name: 'Reliance Enterprise Cloud Solutions',
      email: 'accounts@reliancecloud.in',
      phone: '+91 22 7967 8000',
      address: 'Reliance Corporate Park, Thane-Belapur Road, Navi Mumbai, Maharashtra 400701',
      company: 'Reliance Industries Group',
      gstin: '27AABCR1234N1ZT',
      pan: 'AABCR1234N',
      state: 'Maharashtra',
      stateCode: '27',
      totalSpent: 620000,
      billsCount: 4,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-004',
      name: 'Zomato Commerce Logistics India',
      email: 'payables@zomatotech.in',
      phone: '+91 124 412 7700',
      address: 'Ground Floor, Tower B, Pioneer Square, Sector 62, Gurugram, Haryana 122098',
      company: 'Zomato Technologies',
      gstin: '06AADCB7654C1ZF',
      pan: 'AADCB7654C',
      state: 'Haryana',
      stateCode: '06',
      totalSpent: 890000,
      billsCount: 6,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-005',
      name: 'Bengaluru Tech Labs & Media',
      email: 'accounts@blrlabs.io',
      phone: '+91 98450 12345',
      address: '14th Main, 4th Sector, HSR Layout, Bengaluru, Karnataka 560102',
      company: 'BLR Labs Media',
      gstin: '29AACB09876K1ZQ',
      pan: 'AACB09876K',
      state: 'Karnataka',
      stateCode: '29',
      totalSpent: 215000,
      billsCount: 2,
      status: 'ACTIVE'
    }
  ];

  private customersSubject = new BehaviorSubject<Customer[]>(this.initialCustomers);
  public customers$ = this.customersSubject.asObservable();

  getCustomers(): Observable<Customer[]> {
    return of(this.customersSubject.value);
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    const customer = this.customersSubject.value.find(c => c.id === id);
    return of(customer);
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    const current = this.customersSubject.value;
    const nextId = `CUST-${String(current.length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      id: nextId,
      name: customerData.name || 'New Customer',
      email: customerData.email || 'customer@example.in',
      phone: customerData.phone || '+91 98000 00000',
      address: customerData.address || 'Bengaluru, Karnataka, India',
      company: customerData.company || customerData.name || 'Organization',
      gstin: customerData.gstin || '',
      pan: customerData.pan || '',
      state: customerData.state || 'Karnataka',
      stateCode: customerData.stateCode || '29',
      totalSpent: 0,
      billsCount: 0,
      status: 'ACTIVE'
    };

    const updated = [newCustomer, ...current];
    this.customersSubject.next(updated);
    return of(newCustomer);
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer | null> {
    const current = this.customersSubject.value;
    const index = current.findIndex(c => c.id === id);
    if (index === -1) return of(null);

    const merged = { ...current[index], ...customerData };
    const updated = [...current];
    updated[index] = merged;
    this.customersSubject.next(updated);
    return of(merged);
  }

  deleteCustomer(id: string): Observable<boolean> {
    const filtered = this.customersSubject.value.filter(c => c.id !== id);
    this.customersSubject.next(filtered);
    return of(true);
  }
}
