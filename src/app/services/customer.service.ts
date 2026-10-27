import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { API_BASE_URL } from './api.config';

// Keys the backend may use to wrap a list of customers
const LIST_WRAPPER_KEYS = ['customers', 'data', 'content', 'result', 'customerList', 'items', 'records', 'body'];

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);

  getCustomers(): Observable<Customer[]> {
    return this.http.get<unknown>(`${API_BASE_URL}/customers`).pipe(
      map(response => this.unwrapList(response).map(c => this.normalize(c)))
    );
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<any>(`${API_BASE_URL}/customers/${id}`).pipe(
      map(response => this.normalize(this.unwrapItem(response)))
    );
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    return this.http.post<any>(`${API_BASE_URL}/customers`, customerData).pipe(
      map(response => this.normalize(this.unwrapItem(response)))
    );
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<any>(`${API_BASE_URL}/customers/${id}`, customerData).pipe(
      map(response => this.normalize(this.unwrapItem(response)))
    );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/customers/${id}`);
  }

  private unwrapList(response: unknown): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>;
      for (const key of LIST_WRAPPER_KEYS) {
        if (Array.isArray(obj[key])) {
          return obj[key] as any[];
        }
      }
      console.warn('[CustomerService] Unexpected list response shape. Keys found:', Object.keys(obj));
    }
    return [];
  }

  private unwrapItem(response: any): any {
    return response?.customer ?? response?.data ?? response ?? {};
  }

  private normalize(c: any): Customer {
    const status = String(c.status ?? 'ACTIVE').toUpperCase();
    return {
      id:         String(c.id ?? c.customerId ?? c.customer_id ?? ''),
      name:       c.name ?? c.customerName ?? c.customer_name ?? '',
      email:      c.email ?? c.emailAddress ?? c.email_address ?? '',
      phone:      String(c.phone ?? c.phoneNumber ?? c.phone_number ?? c.mobile ?? ''),
      address:    c.address ?? c.addressLine ?? '',
      company:    c.company ?? c.companyName ?? c.company_name ?? c.organization ?? undefined,
      gstin:      c.gstin ?? c.gstNumber ?? c.gst_number ?? undefined,
      pan:        c.pan ?? c.panNumber ?? undefined,
      state:      c.state ?? c.stateName ?? undefined,
      stateCode:  c.stateCode ?? c.state_code ?? undefined,
      totalSpent: Number(c.totalSpent ?? c.total_spent ?? c.totalInvoiced ?? 0) || 0,
      billsCount: Number(c.billsCount ?? c.bills_count ?? c.totalBills ?? 0) || 0,
      status:     status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };
  }
}
