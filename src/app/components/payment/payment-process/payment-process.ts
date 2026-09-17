import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-process.html',
  styleUrl: './payment-process.css'
})
export class PaymentProcessComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private billService = inject(BillService);
  private router = inject(Router);

  unpaidBills: Bill[] = [];
  selectedBillId = '';
  selectedBill: Bill | null = null;

  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' = 'CREDIT_CARD';
  cardNumber = '4242 •••• •••• 4242';
  cardExpiry = '12/28';
  cardCvc = '884';
  cardHolder = 'John Vance';
  isProcessing = false;

  ngOnInit() {
    this.billService.getBills().subscribe(bills => {
      this.unpaidBills = bills.filter(b => b.status !== 'PAID');

      if (this.unpaidBills.length > 0) {
        this.selectBill(this.unpaidBills[0].id);
      }
    });
  }

  selectBill(billId: string) {
    this.selectedBillId = billId;
    this.selectedBill = this.unpaidBills.find(b => b.id === billId) || null;
  }

  processPayment() {
    if (!this.selectedBill) return;

    this.isProcessing = true;
    setTimeout(() => {
      this.paymentService.processPayment({
        billId: this.selectedBill!.id,
        customerName: this.selectedBill!.customerName,
        amount: this.selectedBill!.total,
        method: this.paymentMethod
      }).subscribe(() => {
        this.isProcessing = false;
        this.router.navigate(['/payments/success']);
      });
    }, 600);
  }
}