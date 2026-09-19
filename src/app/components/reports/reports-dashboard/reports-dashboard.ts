import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css'
})
export class ReportsDashboardComponent {
  totalRevenueYTD = 12450000;
  totalBillsGenerated = 1245;
  collectionRate = 96.4;

  monthlyData = [
    { month: 'Jan', value: 45, amount: '₹12,40,000' },
    { month: 'Feb', value: 68, amount: '₹18,20,000' },
    { month: 'Mar', value: 52, amount: '₹14,90,000' },
    { month: 'Apr', value: 80, amount: '₹22,50,000' },
    { month: 'May', value: 95, amount: '₹28,10,000' },
    { month: 'Jun', value: 72, amount: '₹20,30,000' }
  ];
}