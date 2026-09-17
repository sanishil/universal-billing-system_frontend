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
            customerName: 'Acme Global Technologies',
            items: [
              { name: 'Enterprise Cloud Infrastructure Hosting', quantity: 1, price: 1850 },
              { name: 'Dedicated Support & Maintenance', quantity: 1, price: 650 },
              { name: 'SSL Security Cert & Audit', quantity: 2, price: 150 }
            ],
            subtotal: 2800,
            tax: 280,
            total: 3080,
            status: 'PAID',
            uniqueLink: 'bill-acme-2026001',
            createdAt: '2026-09-10',
            dueDate: '2026-09-24',
            notes: 'Payment settled in full.'
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