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

  paymentMethod: 'UPI' | 'NET_BANKING' | 'RUPAY_CARD' | 'NEFT_RTGS' = 'UPI';

  // UPI fields
  upiId = 'accounts@oksbi';
  selectedUpiApp = 'GPay';

  // Net Banking fields
  selectedBank = 'SBI';
  indianBanks = [
    { code: 'SBI', name: 'State Bank of India', icon: '🏛️' },
    { code: 'HDFC', name: 'HDFC Bank', icon: '🏦' },
    { code: 'ICICI', name: 'ICICI Bank', icon: '🏧' },
    { code: 'AXIS', name: 'Axis Bank', icon: '🏢' },
    { code: 'KOTAK', name: 'Kotak Mahindra', icon: '🏛️' },
    { code: 'PNB', name: 'Punjab National Bank', icon: '🏦' }
  ];

  // Card fields
  cardNumber = '6073 •••• •••• 9924';
  cardExpiry = '08/29';
  cardCvc = '714';
  cardHolder = 'Rajesh Kumar';
  isRuPay = true;

  // NEFT / RTGS fields
  neftUtr = 'SBIN26258190012';

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
        method: this.paymentMethod,
        upiId: this.paymentMethod === 'UPI' ? this.upiId : undefined,
        bankName: this.paymentMethod === 'NET_BANKING' ? this.selectedBank : undefined
      }).subscribe(() => {
        this.isProcessing = false;
        this.router.navigate(['/payments/success']);
      });
    }, 600);
  }
}