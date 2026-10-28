import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  gstin: string;
  businessName: string;
  address: string;
  /** Supplier state for GST; bills can't be issued until this is set */
  stateCode: string;
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

  getSystemSettings(): Observable<SystemSettingsPayload> {
    return this.http.get<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`);
  }

  updateSystemSettings(payload: SystemSettingsPayload): Observable<SystemSettingsPayload> {
    return this.http.put<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`, payload);
  }
}
