import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BillService, BillStats } from '../../../services/bill.service';
import { CustomerService } from '../../../services/customer.service';
import { PaymentService } from '../../../services/payment.service';
import { ToastService } from '../../../services/toast.service';
import { Bill } from '../../../models/bill';
import { Customer } from '../../../models/customer';
import { Payment } from '../../../models/payment';

export interface MonthlyPerformance {
  month: string;
  amount: string;
  heightPercent: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private billService = inject(BillService);
  private customerService = inject(CustomerService);
  private paymentService = inject(PaymentService);
  private toast = inject(ToastService);

  private loadErrorShown = false;

  bills: Bill[] = [];
  customers: Customer[] = [];
  recentPayments: Payment[] = [];
  monthlyPerformance: MonthlyPerformance[] = [];

  stats: BillStats = {
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    totalCount: 0
  };

  ngOnInit() {
    const onError = () => this.reportLoadError();

    this.billService.getBills().subscribe({
      next: bills => this.bills = bills,
      error: onError
    });

    this.billService.getStats().subscribe({
      next: stats => this.stats = stats,
      error: onError
    });

    this.customerService.getCustomers().subscribe({
      next: customers => this.customers = customers,
      error: onError
    });

    this.paymentService.getPayments().subscribe({
      next: payments => this.recentPayments = payments.slice(0, 4),
      error: onError
    });
  }

  // Several requests can fail together (e.g. server down); show a single toast for all of them
  private reportLoadError(): void {
    if (this.loadErrorShown) return;
    this.loadErrorShown = true;
    this.toast.error('Some dashboard data could not be loaded. Please refresh to try again.');
  }
}
