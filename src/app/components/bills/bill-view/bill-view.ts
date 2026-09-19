import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { PdfService } from '../../../services/pdf.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-bill-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bill-view.html',
  styleUrl: './bill-view.css'
})
export class BillViewComponent implements OnInit {
  private billService = inject(BillService);
  private pdfService = inject(PdfService);
  private route = inject(ActivatedRoute);

  bill: Bill | null = null;
  copied = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.billService.getBillById(id).subscribe(b => {
        if (b) {
          this.bill = b;
        } else {
          // Fallback mock
          this.bill = {
            id,
            customerId: 'CUST-001',
            customerName: 'Infosys Digital Systems Ltd.',
            customerGstin: '29AAACI4321A1ZG',
            supplierGstin: '29AABCU9603R1ZM',
            placeOfSupply: 'Karnataka (29)',
            stateCode: '29',
            items: [
              { name: 'Enterprise Cloud Infrastructure & Kubernetes', hsnSac: '998315', quantity: 1, price: 85000 },
              { name: 'Dedicated Support & 24/7 SLA Retainer', hsnSac: '998314', quantity: 1, price: 45000 },
              { name: 'Security Cert Audit & Vulnerability Assessment', hsnSac: '998316', quantity: 2, price: 12500 }
            ],
            subtotal: 155000,
            cgst: 13950,
            sgst: 13950,
            igst: 0,
            tax: 27900,
            total: 182900,
            amountInWords: 'Rupees One Lakh Eighty Two Thousand Nine Hundred Only',
            currency: 'INR',
            status: 'PAID',
            uniqueLink: 'bill-infosys-2026001',
            createdAt: '2026-09-10',
            dueDate: '2026-09-24',
            notes: 'Payment received via SBI Net Banking. Thank you for your business!'
          };
        }
      });
    }
  }

  printInvoice() {
    this.pdfService.printInvoice();
  }

  markPaid() {
    if (this.bill) {
      this.billService.markAsPaid(this.bill.id).subscribe(updated => {
        if (updated) {
          this.bill = updated;
        }
      });
    }
  }

  copyPublicLink() {
    if (this.bill) {
      const url = `${window.location.origin}/bill/view/${this.bill.uniqueLink}`;
      navigator.clipboard.writeText(url);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }
  }
}