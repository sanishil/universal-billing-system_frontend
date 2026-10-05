import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${API_BASE_URL}/customers`);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${API_BASE_URL}/customers/${id}`);
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${API_BASE_URL}/customers`, customerData);
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${API_BASE_URL}/customers/${id}`, customerData);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/customers/${id}`);
  }
}
