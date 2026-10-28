import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DEFAULT_GST_RATES, SettingsService, SystemSettingsPayload } from '../../../services/settings.service';
import { ToastService } from '../../../services/toast.service';
import { GstRateSelectComponent } from '../../shared/gst-rate-select/gst-rate-select';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GstRateSelectComponent],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css'
})
export class SystemSettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private toast = inject(ToastService);

  // Billing & Tax
  currency = '';
  taxLabel = '';
  invoicePrefix = '';
  invoiceStartNumber = 0;
  dueDays = 0;
  gstRates: number[] = DEFAULT_GST_RATES;
  /** null = new bills default to No GST */
  defaultGstRate: number | null = 18;
  autoEmailOnCreate = false;

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

  isSaving = false;

  /** The rate list as typed, e.g. "0, 5, 18, 40"; parsed into gstRates on every change */
  gstRatesText = DEFAULT_GST_RATES.join(', ');

  onGstRatesTextChange(text: string): void {
    this.gstRatesText = text;
    const rates = text
      .split(',')
      .map(r => r.trim())
      .filter(r => r !== '')
      .map(Number)
      .filter(r => Number.isFinite(r) && r >= 0 && r <= 100);
    this.gstRates = [...new Set(rates)].sort((a, b) => a - b);
  }

  ngOnInit() {
    this.settingsService.getSystemSettings().subscribe(s => {
      this.currency = s.currency;
      this.taxLabel = s.taxLabel;
      this.invoicePrefix = s.invoicePrefix;
      this.invoiceStartNumber = s.invoiceStartNumber;
      this.dueDays = s.dueDays;
      this.gstRates = s.gstRates?.length ? s.gstRates : DEFAULT_GST_RATES;
      this.gstRatesText = this.gstRates.join(', ');
      // Older backends only have taxRate
      this.defaultGstRate = s.defaultGstRate !== undefined ? s.defaultGstRate : s.taxRate;
      this.autoEmailOnCreate = !!s.autoEmailOnCreate;
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
    if (this.defaultGstRate !== null && !this.gstRates.includes(this.defaultGstRate)) {
      this.toast.error('The default GST rate must be one of the allowed rates, or No GST.');
      return;
    }

    const payload: SystemSettingsPayload = {
      currency: this.currency,
      taxRate: this.defaultGstRate ?? 0,
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
      weeklyReport: this.weeklyReport,
      gstRates: this.gstRates,
      defaultGstRate: this.defaultGstRate,
      autoEmailOnCreate: this.autoEmailOnCreate
    };

    this.isSaving = true;
    this.settingsService.updateSystemSettings(payload)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => this.toast.success('Settings saved.'),
        error: (err) => this.toast.error(err.error?.message || 'Settings could not be saved. Please try again.')
      });
  }

  resetSettings() {
    this.ngOnInit();
  }
}
