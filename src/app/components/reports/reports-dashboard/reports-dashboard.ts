import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../../services/api.config';

export interface ReportStats {
  totalRevenueYTD: number;
  totalBillsGenerated: number;
  collectionRate: number;
  /** Subtotal of bills with GST applied (gstRate not null) */
  taxableSales?: number;
  taxCollected?: number;
  /** Bills issued with No GST (Bill of Supply), reported separately */
  nonGstSales?: number;
}

export interface MonthlyData {
  month: string;
  value: number;
  amount: string;
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

  totalRevenueYTD = 0;
  totalBillsGenerated = 0;
  collectionRate = 0;
  taxableSales = 0;
  taxCollected = 0;
  nonGstSales = 0;
  monthlyData: MonthlyData[] = [];

  ngOnInit() {
    this.http.get<ReportStats>(`${API_BASE_URL}/reports/stats`).subscribe(stats => {
      this.totalRevenueYTD = stats.totalRevenueYTD;
      this.totalBillsGenerated = stats.totalBillsGenerated;
      this.collectionRate = stats.collectionRate;
      this.taxableSales = stats.taxableSales ?? 0;
      this.taxCollected = stats.taxCollected ?? 0;
      this.nonGstSales = stats.nonGstSales ?? 0;
    });

    this.http.get<MonthlyData[]>(`${API_BASE_URL}/reports/monthly`).subscribe(data => {
      this.monthlyData = data;
    });
  }
}
