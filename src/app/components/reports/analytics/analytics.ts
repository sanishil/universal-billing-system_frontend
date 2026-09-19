import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AnalyticsComponent {
  paymentMethods = [
    { name: 'UPI (GPay / PhonePe / Paytm / BHIM)', percent: 54, volume: '₹67,23,000' },
    { name: 'Corporate Net Banking (SBI / HDFC / ICICI)', percent: 28, volume: '₹34,86,000' },
    { name: 'RuPay & Commercial Cards', percent: 14, volume: '₹17,43,000' },
    { name: 'Direct Bank Wire (NEFT / RTGS)', percent: 4, volume: '₹4,98,000' }
  ];

  billStatusBreakdown = [
    { name: 'Paid & Cleared', count: 1204, percent: 85, colorClass: 'ubs-bar-green' },
    { name: 'Awaiting Settlement', count: 150, percent: 11, colorClass: 'ubs-bar-amber' },
    { name: 'Overdue / Escalated', count: 52, percent: 4, colorClass: 'ubs-bar-red' }
  ];
}