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
  isLoading = true;
  notFound = false;
  copied = false;

  // Watermark
  watermarkActive = false;
  watermarkOptions = ['PAID', 'CONFIDENTIAL', 'DRAFT', 'COPY'];
  watermarkIndex = 0;

  get watermarkText(): string {
    return this.watermarkOptions[this.watermarkIndex];
  }

  toggleWatermark() {
    if (!this.watermarkActive) {
      this.watermarkActive = true;
    } else {
      this.watermarkIndex = (this.watermarkIndex + 1) % this.watermarkOptions.length;
      if (this.watermarkIndex === 0) {
        this.watermarkActive = false;
      }
    }
  }

  get watermarkButtonLabel(): string {
    if (!this.watermarkActive) return 'Add Watermark';
    return `Watermark: ${this.watermarkText}`;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.billService.getBillById(id).subscribe({
        next: b => {
          this.bill = b;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notFound = true;
        }
      });
    } else {
      this.isLoading = false;
      this.notFound = true;
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
