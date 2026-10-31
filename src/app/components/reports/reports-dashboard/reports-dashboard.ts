import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { API_BASE_URL } from '../../../services/api.config';

export interface MonthlyData {
  month: string;
  /** Bar height, percent of the best month */
  value: number;
  /** Short label, e.g. ₹4.5K */
  amount: string;
}

export interface ItemRevenue {
  name: string;
  amount: number;
  percent: number;
}

/** GET /reports/dashboard — every figure is computed from saved bills, customers and payments */
export interface ReportDashboard {
  totalRevenueYTD: number;
  /** null when last year had no settled revenue */
  yoyGrowthPercent: number | null;
  totalBillsGenerated: number;
  paidCount: number;
  collectionRate: number;
  outstandingAmount: number;
  unpaidCount: number;
  overdueCount: number;
  customerCount: number;
  newCustomersThisQuarter: number;
  avgInvoiceValue: number;
  /** null until a bill has a successful payment */
  avgDaysToPay: number | null;
  taxableSales: number;
  taxCollected: number;
  nonGstSales: number;
  revenueByItem: ItemRevenue[];
  monthlyData: MonthlyData[];
}

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css'
})
export class ReportsDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  // The app runs without zone.js, so HTTP responses don't re-render on their own
  private cdr = inject(ChangeDetectorRef);

  readonly categoryColors = [
    'var(--ubs-blue-600)',
    'var(--ubs-success-text)',
    'var(--ubs-warning-text)',
    'var(--ubs-danger-text)'
  ];

  report: ReportDashboard | null = null;
  isLoading = true;
  loadFailed = false;

  ngOnInit() {
    this.http.get<ReportDashboard>(`${API_BASE_URL}/reports/dashboard`)
      .pipe(finalize(() => { this.isLoading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: report => this.report = report,
        error: () => this.loadFailed = true
      });
  }
}
