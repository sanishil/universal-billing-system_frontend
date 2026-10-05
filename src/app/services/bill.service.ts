import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';
import { API_BASE_URL } from './api.config';

export interface BillStats {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private http = inject(HttpClient);

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${API_BASE_URL}/bills`);
  }

  getBillById(id: string): Observable<Bill> {
    return this.http.get<Bill>(`${API_BASE_URL}/bills/${id}`);
  }

  getBillByUniqueLink(uniqueLink: string): Observable<Bill> {
    return this.http.get<Bill>(`${API_BASE_URL}/bills/link/${uniqueLink}`);
  }

  createBill(billData: Partial<Bill>): Observable<Bill> {
    return this.http.post<Bill>(`${API_BASE_URL}/bills`, billData);
  }

  updateBill(id: string, updatedData: Partial<Bill>): Observable<Bill> {
    return this.http.put<Bill>(`${API_BASE_URL}/bills/${id}`, updatedData);
  }

  deleteBill(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/bills/${id}`);
  }

  markAsPaid(id: string): Observable<Bill> {
    return this.http.patch<Bill>(`${API_BASE_URL}/bills/${id}/mark-paid`, {});
  }

  getStats(): Observable<BillStats> {
    return this.http.get<BillStats>(`${API_BASE_URL}/bills/stats`);
  }
}
