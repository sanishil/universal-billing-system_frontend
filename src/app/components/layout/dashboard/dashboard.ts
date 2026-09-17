import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { CustomerService } from '../../../services/customer.service';
import { PaymentService } from '../../../services/payment.service';
import { Bill } from '../../../models/bill';
import { Customer } from '../../../models/customer';
import { Payment } from '../../../models/payment';

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

  stats = {
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    totalCount: 0
  };

  monthlyPerformance = [
    { month: 'Apr', amount: '$3,800', heightPercent: 42 },
    { month: 'May', amount: '$5,400', heightPercent: 60 },
    { month: 'Jun', amount: '$6,900', heightPercent: 75 },
    { month: 'Jul', amount: '$4,200', heightPercent: 48 },
    { month: 'Aug', amount: '$7,800', heightPercent: 86 },
    { month: 'Sep', amount: '$9,287', heightPercent: 100 }
  ];

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
