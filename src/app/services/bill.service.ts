import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill, BillQuery, BillRequest, BillScope, ShareLink } from '../models/bill';
import { BillEmailLog, SendBillEmailRequest, SendBillEmailResponse } from '../models/bill-email';
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

  /** Bills the user issued (scope=sent, the default) or received (scope=received) */
  getBills(query: BillQuery = {}): Observable<Bill[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params = params.set(key, value);
    }
    return this.http.get<Bill[]>(`${API_BASE_URL}/bills`, { params });
  }

  getBillById(id: string): Observable<Bill> {
    return this.http.get<Bill>(`${API_BASE_URL}/bills/${id}`);
  }

  createBill(billData: BillRequest): Observable<Bill> {
    return this.http.post<Bill>(`${API_BASE_URL}/bills`, billData);
  }

  updateBill(id: string, updatedData: BillRequest): Observable<Bill> {
    return this.http.put<Bill>(`${API_BASE_URL}/bills/${id}`, updatedData);
  }

  deleteBill(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/bills/${id}`);
  }

  markAsPaid(id: string): Observable<Bill> {
    return this.http.patch<Bill>(`${API_BASE_URL}/bills/${id}/mark-paid`, {});
  }

  getStats(scope: BillScope = 'sent'): Observable<BillStats> {
    return this.http.get<BillStats>(`${API_BASE_URL}/bills/stats`, { params: { scope } });
  }

  /** Public print link. Use the returned url as-is so copied and emailed links always match. */
  getShareLink(id: string, regenerate = false): Observable<ShareLink> {
    return this.http.post<ShareLink>(`${API_BASE_URL}/bills/${id}/share-link`, { regenerate });
  }

  sendEmail(id: string, request: SendBillEmailRequest): Observable<SendBillEmailResponse> {
    return this.http.post<SendBillEmailResponse>(`${API_BASE_URL}/bills/${id}/send-email`, request);
  }

  getEmails(id: string): Observable<BillEmailLog[]> {
    return this.http.get<BillEmailLog[]>(`${API_BASE_URL}/bills/${id}/emails`);
  }
}
