import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css'
})
export class SystemSettingsComponent {

  // Billing & Tax
  currency = 'INR';
  taxRate = 18;
  taxLabel = 'GST';
  invoicePrefix = 'INV';
  invoiceStartNumber = 1001;
  dueDays = 30;

  // Company
  companyName = 'Universal Billing Pvt. Ltd.';
  companyEmail = 'billing@universalbilling.in';
  companyPhone = '+91 98765 43210';
  companyAddress = '12, Tech Park, Pune, Maharashtra - 411014';
  companyGstin = '27AABCU9603R1ZX';
  companyWebsite = 'https://universalbilling.in';

  // Appearance & Regional
  dateFormat = 'DD/MM/YYYY';
  timeZone = 'Asia/Kolkata';
  language = 'en';

  // Notifications
  emailOnPayment = true;
  emailOnOverdue = true;
  emailOnNewClient = false;
  weeklyReport = true;

  saveSettings() {
    console.log('System settings saved');
  }

  resetSettings() {
    this.currency = 'INR';
    this.taxRate = 18;
    this.taxLabel = 'GST';
    this.invoicePrefix = 'INV';
    this.invoiceStartNumber = 1001;
    this.dueDays = 30;
    this.companyName = 'Universal Billing Pvt. Ltd.';
    this.companyEmail = 'billing@universalbilling.in';
    this.companyPhone = '+91 98765 43210';
    this.companyAddress = '12, Tech Park, Pune, Maharashtra - 411014';
    this.companyGstin = '27AABCU9603R1ZX';
    this.companyWebsite = 'https://universalbilling.in';
    this.dateFormat = 'DD/MM/YYYY';
    this.timeZone = 'Asia/Kolkata';
    this.language = 'en';
    this.emailOnPayment = true;
    this.emailOnOverdue = true;
    this.emailOnNewClient = false;
    this.weeklyReport = true;
  }
}
