import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-public-bill-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-bill-view.html',
  styleUrl: './public-bill-view.css'
})
export class PublicBillViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private billService = inject(BillService);

  bill: Bill | null = null;
  paidSuccess = false;

  ngOnInit() {
    const uniqueId = this.route.snapshot.paramMap.get('uniqueId') || '';
    this.billService.getBillByUniqueLink(uniqueId).subscribe(b => {
      if (b) {
        this.bill = b;
      } else {
        // Mock fallback if unique link was custom
        this.bill = {
          id: 'INV-2026-002',
          customerId: 'CUST-002',
          customerName: 'Tata Tech Solutions Pvt. Ltd.',
          customerGstin: '27AAACT2941E1ZY',
          supplierGstin: '29AABCU9603R1ZM',
          placeOfSupply: 'Maharashtra (27)',
          isInterState: true,
          gstRate: 18,
          items: [
            { id: 'item-4', name: 'UI/UX Brand Design Tokens & System Engineering', hsnSac: '998314', quantity: 1, price: 120000 },
            { id: 'item-5', name: 'Frontend Angular Integration & Consulting', hsnSac: '998313', quantity: 12, price: 7500 }
          ],
          subtotal: 210000,
          cgst: 0,
          sgst: 0,
          igst: 37800,
          tax: 37800,
          total: 247800,
          amountInWords: 'Rupees Two Lakh Forty Seven Thousand Eight Hundred Only',
          currency: 'INR',
          status: 'PENDING',
          uniqueLink: uniqueId,
          createdAt: '2026-09-12',
          dueDate: '2026-09-26',
          notes: 'Payment terms: 14 days. Settle via UPI (billing@sbi) or NEFT.'
        };
      }
    });
  }

  simulateUpiPay() {
    if (this.bill) {
      this.billService.markAsPaid(this.bill.id).subscribe(() => {
        if (this.bill) {
          this.bill.status = 'PAID';
        }
        this.paidSuccess = true;
      });
    }
  }

  printInvoice() {
    window.print();
  }
}