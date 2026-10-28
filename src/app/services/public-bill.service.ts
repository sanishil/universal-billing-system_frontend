import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';
import { API_BASE_URL, SKIP_AUTH } from './api.config';

/** Endpoints reachable from the public share link — no login, never sends a Bearer token. */
@Injectable({
  providedIn: 'root'
})
export class PublicBillService {
  private http = inject(HttpClient);
  private context = new HttpContext().set(SKIP_AUTH, true);

  /** 404 for an unknown link, 410 when it has expired or been revoked */
  getBill(uniqueId: string): Observable<Bill> {
    return this.http.get<Bill>(`${API_BASE_URL}/bills/link/${encodeURIComponent(uniqueId)}`, {
      context: this.context
    });
  }

  getPdf(uniqueId: string): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/bills/link/${encodeURIComponent(uniqueId)}/pdf`, {
      context: this.context,
      responseType: 'blob'
    });
  }
}
