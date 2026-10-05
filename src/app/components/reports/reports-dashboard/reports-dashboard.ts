import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../../services/api.config';

export interface ReportStats {
  totalRevenueYTD: number;
  totalBillsGenerated: number;
  collectionRate: number;
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
  monthlyData: MonthlyData[] = [];

  ngOnInit() {
    this.http.get<ReportStats>(`${API_BASE_URL}/reports/stats`).subscribe(stats => {
      this.totalRevenueYTD = stats.totalRevenueYTD;
      this.totalBillsGenerated = stats.totalBillsGenerated;
      this.collectionRate = stats.collectionRate;
    });

    this.http.get<MonthlyData[]>(`${API_BASE_URL}/reports/monthly`).subscribe(data => {
      this.monthlyData = data;
    });
  }
}
