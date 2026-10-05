import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BillService, BillStats } from '../../../services/bill.service';
import { CustomerService } from '../../../services/customer.service';
import { PaymentService } from '../../../services/payment.service';
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
    this.billService.getBills().subscribe(bills => {
      this.bills = bills;
    });

    this.billService.getStats().subscribe(stats => {
      this.stats = stats;
    });

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.paymentService.getPayments().subscribe(payments => {
      this.recentPayments = payments.slice(0, 4);
    });
  }
}
