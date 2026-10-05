import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../../services/api.config';

export interface PaymentMethodStat {
  name: string;
  percent: number;
  volume: string;
}

export interface BillStatusStat {
  name: string;
  count: number;
  percent: number;
  colorClass: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AnalyticsComponent implements OnInit {
  private http = inject(HttpClient);

  paymentMethods: PaymentMethodStat[] = [];
  billStatusBreakdown: BillStatusStat[] = [];

  ngOnInit() {
    this.http.get<PaymentMethodStat[]>(`${API_BASE_URL}/analytics/payment-methods`).subscribe(data => {
      this.paymentMethods = data;
    });

    this.http.get<BillStatusStat[]>(`${API_BASE_URL}/analytics/bill-status`).subscribe(data => {
      this.billStatusBreakdown = data;
    });
  }
}
