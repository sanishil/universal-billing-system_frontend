import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.css'
})
export class PaymentHistoryComponent implements OnInit {
  private paymentService = inject(PaymentService);

  payments: Payment[] = [];

  ngOnInit() {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data;
    });
  }
}