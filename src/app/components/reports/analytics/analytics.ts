import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AnalyticsComponent {
  paymentMethods = [
    { name: 'Corporate Credit Card', percent: 62, volume: '$77,190' },
    { name: 'Direct Bank Wire (ACH)', percent: 26, volume: '$32,370' },
    { name: 'PayPal Enterprise', percent: 12, volume: '$14,940' }
  ];

  billStatusBreakdown = [
    { name: 'Paid & Cleared', count: 1204, percent: 85, colorClass: 'ubs-bar-green' },
    { name: 'Awaiting Settlement', count: 150, percent: 11, colorClass: 'ubs-bar-amber' },
    { name: 'Overdue / Escalated', count: 52, percent: 4, colorClass: 'ubs-bar-red' }
  ];
}