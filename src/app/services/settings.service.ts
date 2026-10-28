import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { Business, BusinessPayload } from '../models/business';

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  status?: string;
  /** Business details now live in /settings/businesses; kept for older responses */
  company?: string;
  gstin?: string;
  businessName?: string;
  address?: string;
  stateCode?: string;
}

export interface SystemSettingsPayload {
  currency: string;
  taxRate: number;
  taxLabel: string;
  invoicePrefix: string;
  invoiceStartNumber: number;
  dueDays: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyGstin: string;
  companyWebsite: string;
  dateFormat: string;
  timeZone: string;
  language: string;
  emailOnPayment: boolean;
  emailOnOverdue: boolean;
  emailOnNewClient: boolean;
  weeklyReport: boolean;
  /** Allowed GST rates in percent, e.g. [0, 5, 18, 40] */
  gstRates: number[];
  /** Pre-selected rate on new bills; null = No GST */
  defaultGstRate: number | null;
  /** Pre-ticks "Email bill to customer after saving" */
  autoEmailOnCreate: boolean;
}

/** Main slabs since 22 Sept 2025; used until the backend returns its own list */
export const DEFAULT_GST_RATES = [0, 5, 18, 40];

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  getProfile(): Observable<ProfilePayload> {
    return this.http.get<ProfilePayload>(`${API_BASE_URL}/settings/profile`);
  }

  updateProfile(payload: ProfilePayload): Observable<ProfilePayload> {
    return this.http.put<ProfilePayload>(`${API_BASE_URL}/settings/profile`, payload);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_BASE_URL}/settings/password`, { currentPassword, newPassword });
  }

  /** The user's businesses, oldest first; the first one is the default */
  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${API_BASE_URL}/settings/businesses`);
  }

  createBusiness(payload: BusinessPayload): Observable<Business> {
    return this.http.post<Business>(`${API_BASE_URL}/settings/businesses`, payload);
  }

  updateBusiness(id: string, payload: BusinessPayload): Observable<Business> {
    return this.http.put<Business>(`${API_BASE_URL}/settings/businesses/${id}`, payload);
  }

  deleteBusiness(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/settings/businesses/${id}`);
  }

  getSystemSettings(): Observable<SystemSettingsPayload> {
    return this.http.get<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`);
  }

  updateSystemSettings(payload: SystemSettingsPayload): Observable<SystemSettingsPayload> {
    return this.http.put<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`, payload);
  }
}
