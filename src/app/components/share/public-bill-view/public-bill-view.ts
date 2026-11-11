import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidStampComponent } from '../../shared/paid-stamp/paid-stamp';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicBillService } from '../../../services/public-bill.service';
import { PdfService } from '../../../services/pdf.service';
import { Bill, isGstApplied, statusWatermark, StatusWatermark } from '../../../models/bill';

// Settlement account printed on the invoice; also the payee of the UPI deep link
const UPI_VPA = 'billing@sbi';

/**
 * Read-only bill reached from the emailed/copied share link. No login.
 * Marking paid is issuer-only and deliberately not offered here: the link gets forwarded.
 */
@Component({
  selector: 'app-public-bill-view',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CommonModule, PaidStampComponent],
  templateUrl: './public-bill-view.html',
  styleUrl: './public-bill-view.css'
})
export class PublicBillViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicBillService = inject(PublicBillService);
  private pdfService = inject(PdfService);

  readonly upiVpa = UPI_VPA;

  uniqueId = '';
  bill: Bill | null = null;
  isLoading = true;
  notFound = false;
  /** 410 Gone: the link expired or the issuer revoked it */
  expired = false;
  expiredIssuer = '';
  isDownloading = false;
  downloadFailed = false;

  /** HSN/SAC codes only matter when GST is charged; hidden for No GST and 0 percent */
  get showHsn(): boolean {
    return this.gstApplied && Number(this.gstRate) !== 0;
  }

  get watermark(): StatusWatermark {
    return statusWatermark(this.bill?.status);
  }

  get gstApplied(): boolean {
    return !!this.bill && isGstApplied(this.bill);
  }

  /** Bills saved before optional GST have no rate; they were 18% */
  get gstRate(): number {
    return this.bill?.gstRate ?? 18;
  }

  get issuerName(): string {
    return this.bill?.issuer?.businessName || this.bill?.issuer?.name || 'Universal Billing Solutions India Pvt. Ltd.';
  }

  /** Opens the payer's UPI app with amount and reference filled in */
  get upiPayUrl(): string {
    if (!this.bill) return '';
    const params = new URLSearchParams({
      pa: UPI_VPA,
      pn: this.issuerName,
      am: Number(this.bill.total).toFixed(2),
      cu: 'INR',
      tn: `Invoice ${this.bill.id}`
    });
    return `upi://pay?${params.toString()}`;
  }

  ngOnInit() {
    this.uniqueId = this.route.snapshot.paramMap.get('uniqueId') || '';
    this.publicBillService.getBill(this.uniqueId).subscribe({
      next: b => {
        this.bill = b;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 410) {
          this.expired = true;
          this.expiredIssuer = err.error?.issuerName || '';
        } else {
          this.notFound = true;
        }
      }
    });
  }

  printInvoice() {
    this.pdfService.printInvoice();
  }

  /** Saves the invoice exactly as shown here; falls back to the server PDF if the capture fails */
  async downloadPdf() {
    if (this.isDownloading) return;
    this.isDownloading = true;
    this.downloadFailed = false;
    try {
      await this.pdfService.downloadInvoiceSheet(`Invoice-${this.bill?.id ?? this.uniqueId}.pdf`);
      this.isDownloading = false;
      return;
    } catch {
      // fall through to the server-generated PDF
    }
    this.publicBillService.getPdf(this.uniqueId).subscribe({
      next: blob => {
        this.isDownloading = false;
        this.pdfService.saveBlob(blob, `Invoice-${this.bill?.id ?? this.uniqueId}.pdf`);
      },
      error: () => {
        this.isDownloading = false;
        this.downloadFailed = true;
      }
    });
  }
}
