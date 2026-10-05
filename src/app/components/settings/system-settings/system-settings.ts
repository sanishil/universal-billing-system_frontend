import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../../services/api.config';

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
}

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css'
})
export class SystemSettingsComponent implements OnInit {
  private http = inject(HttpClient);

  // Billing & Tax
  currency = '';
  taxRate = 0;
  taxLabel = '';
  invoicePrefix = '';
  invoiceStartNumber = 0;
  dueDays = 0;

  // Company
  companyName = '';
  companyEmail = '';
  companyPhone = '';
  companyAddress = '';
  companyGstin = '';
  companyWebsite = '';

  // Appearance & Regional
  dateFormat = '';
  timeZone = '';
  language = '';

  // Notifications
  emailOnPayment = false;
  emailOnOverdue = false;
  emailOnNewClient = false;
  weeklyReport = false;

  ngOnInit() {
    this.http.get<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`).subscribe(s => {
      this.currency = s.currency;
      this.taxRate = s.taxRate;
      this.taxLabel = s.taxLabel;
      this.invoicePrefix = s.invoicePrefix;
      this.invoiceStartNumber = s.invoiceStartNumber;
      this.dueDays = s.dueDays;
      this.companyName = s.companyName;
      this.companyEmail = s.companyEmail;
      this.companyPhone = s.companyPhone;
      this.companyAddress = s.companyAddress;
      this.companyGstin = s.companyGstin;
      this.companyWebsite = s.companyWebsite;
      this.dateFormat = s.dateFormat;
      this.timeZone = s.timeZone;
      this.language = s.language;
      this.emailOnPayment = s.emailOnPayment;
      this.emailOnOverdue = s.emailOnOverdue;
      this.emailOnNewClient = s.emailOnNewClient;
      this.weeklyReport = s.weeklyReport;
    });
  }

  saveSettings() {
    const payload: SystemSettingsPayload = {
      currency: this.currency,
      taxRate: this.taxRate,
      taxLabel: this.taxLabel,
      invoicePrefix: this.invoicePrefix,
      invoiceStartNumber: this.invoiceStartNumber,
      dueDays: this.dueDays,
      companyName: this.companyName,
      companyEmail: this.companyEmail,
      companyPhone: this.companyPhone,
      companyAddress: this.companyAddress,
      companyGstin: this.companyGstin,
      companyWebsite: this.companyWebsite,
      dateFormat: this.dateFormat,
      timeZone: this.timeZone,
      language: this.language,
      emailOnPayment: this.emailOnPayment,
      emailOnOverdue: this.emailOnOverdue,
      emailOnNewClient: this.emailOnNewClient,
      weeklyReport: this.weeklyReport
    };
    this.http.put<SystemSettingsPayload>(`${API_BASE_URL}/settings/system`, payload).subscribe();
  }

  resetSettings() {
    this.ngOnInit();
  }
}
