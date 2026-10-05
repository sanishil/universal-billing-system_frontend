import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API_BASE_URL}/payments`);
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${API_BASE_URL}/payments/${id}`);
  }

  processPayment(paymentData: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(`${API_BASE_URL}/payments`, paymentData);
  }
}
