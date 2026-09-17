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
      name: 'Acme Global Technologies',
      email: 'billing@acmeglobal.tech',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Suite 400, Silicon Valley, CA 94025',
      company: 'Acme Corp Group',
      totalSpent: 12850,
      billsCount: 5,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-002',
      name: 'Starlight Design Studio',
      email: 'accounts@starlightdesign.co',
      phone: '+1 (555) 876-5432',
      address: '120 Broadway St, 14th Floor, New York, NY 10006',
      company: 'Starlight Creative',
      totalSpent: 8400,
      billsCount: 3,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-003',
      name: 'Apex Data Logistics',
      email: 'finance@apexdata.io',
      phone: '+1 (555) 345-6789',
      address: '88 Tech Hub Boulevard, Austin, TX 78701',
      company: 'Apex Data Systems',
      totalSpent: 15400,
      billsCount: 4,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-004',
      name: 'Nexus Fintech Corp',
      email: 'payables@nexusfintech.com',
      phone: '+1 (555) 987-6543',
      address: '350 Financial Plaza, Charlotte, NC 28202',
      company: 'Nexus Capital',
      totalSpent: 22100,
      billsCount: 6,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-005',
      name: 'Horizon Media Ventures',
      email: 'contact@horizonmedia.net',
      phone: '+1 (555) 456-7890',
      address: '500 Sunset Blvd, Los Angeles, CA 90028',
      company: 'Horizon Entertainment',
      totalSpent: 5980,
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
      email: customerData.email || 'customer@example.com',
      phone: customerData.phone || '+1 (555) 000-0000',
      address: customerData.address || 'No address provided',
      company: customerData.company || customerData.name || 'Organization',
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
