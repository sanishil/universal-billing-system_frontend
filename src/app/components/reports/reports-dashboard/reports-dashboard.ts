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
  totalRevenueYTD = 124500;
  totalBillsGenerated = 1245;
  collectionRate = 94.2;

  monthlyData = [
    { month: 'Jan', value: 45, amount: '$12,400' },
    { month: 'Feb', value: 68, amount: '$18,200' },
    { month: 'Mar', value: 52, amount: '$14,900' },
    { month: 'Apr', value: 80, amount: '$22,500' },
    { month: 'May', value: 95, amount: '$28,100' },
    { month: 'Jun', value: 72, amount: '$20,300' }
  ];
}