import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidStampComponent } from '../../shared/paid-stamp/paid-stamp';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { PdfService } from '../../../services/pdf.service';
import { PublicBillService } from '../../../services/public-bill.service';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';
import { Bill, isGstApplied, isIssuer, statusWatermark, StatusWatermark } from '../../../models/bill';
import { SendBillDialogComponent } from '../../shared/send-bill-dialog/send-bill-dialog';
import { BillEmailHistoryComponent } from '../bill-email-history/bill-email-history';

// Shown when the backend doesn't return issuer details yet (bills from before the billing loop)
const FALLBACK_ISSUER = {
  name: 'Universal Billing Solutions India Pvt. Ltd.',
  gstin: '29AABCU9603R1ZM',
  address: 'Salarpuria Cyber Towers, 4th Floor, HSR Layout, Bengaluru, Karnataka - 560102',
  stateCode: '29'
};

@Component({
  selector: 'app-bill-view',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CommonModule, RouterLink, SendBillDialogComponent, BillEmailHistoryComponent, PaidStampComponent],
  templateUrl: './bill-view.html',
  styleUrl: './bill-view.css'
})
export class BillViewComponent implements OnInit {
  private billService = inject(BillService);
  private pdfService = inject(PdfService);
  private publicBillService = inject(PublicBillService);
  private customerService = inject(CustomerService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  bill: Bill | null = null;
  isLoading = true;
  notFound = false;
  copied = false;
  isCopying = false;

  showSendDialog = false;
  customerEmail = '';
  /** Bumped to reload the email history after a send */
  emailHistoryRefresh = 0;

  /** Status watermark (PAID / UNPAID / OVERDUE) is shown by default; the stamp button hides it */
  watermarkActive = true;

  get watermark(): StatusWatermark {
    return statusWatermark(this.bill?.status);
  }

  get isIssuer(): boolean {
    return !!this.bill && isIssuer(this.bill);
  }

  /** HSN/SAC codes only matter when GST is charged; hidden for No GST and 0 percent */
  get showHsn(): boolean {
    return this.gstApplied && Number(this.gstRate) !== 0;
  }

  get gstApplied(): boolean {
    return !!this.bill && isGstApplied(this.bill);
  }

  /** Bills saved before optional GST have no rate; they were 18% */
  get gstRate(): number {
    return this.bill?.gstRate ?? 18;
  }

  get issuerName(): string {
    return this.bill?.issuer?.businessName || this.bill?.issuer?.name || FALLBACK_ISSUER.name;
  }

  get issuerGstin(): string | null {
    return this.bill?.issuer ? (this.bill.issuer.gstin ?? null) : FALLBACK_ISSUER.gstin;
  }

  get issuerAddress(): string {
    return this.bill?.issuer ? (this.bill.issuer.address ?? '') : FALLBACK_ISSUER.address;
  }

  get issuerStateCode(): string {
    return this.bill?.supplierStateCode || this.bill?.issuer?.stateCode || FALLBACK_ISSUER.stateCode;
  }

  toggleWatermark() {
    this.watermarkActive = !this.watermarkActive;
  }

  get watermarkButtonLabel(): string {
    return this.watermarkActive ? `Hide ${this.watermark.text} watermark` : `Show ${this.watermark.text} watermark`;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.billService.getBillById(id).subscribe({
        next: b => {
          this.bill = b;
          this.isLoading = false;
          // Pre-fills "To" in the send-email dialog
          if (isIssuer(b) && b.customerId) {
            this.customerService.getCustomerById(b.customerId).subscribe({
              next: c => this.customerEmail = c.email,
              error: () => {}
            });
          }
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

  isDownloading = false;

  /** Saves the invoice exactly as shown here; falls back to the server PDF if the capture fails */
  async downloadPdf() {
    if (!this.bill || this.isDownloading) return;
    this.isDownloading = true;
    const filename = `Invoice-${this.bill.id}.pdf`;
    try {
      await this.pdfService.downloadInvoiceSheet(filename);
      this.isDownloading = false;
    } catch {
      const token = this.bill.publicUrl?.split('/').pop();
      if (!token) {
        this.isDownloading = false;
        this.toast.error('The PDF could not be created. Use Print and choose "Save as PDF" instead.');
        return;
      }
      this.publicBillService.getPdf(token).subscribe({
        next: blob => {
          this.isDownloading = false;
          this.pdfService.saveBlob(blob, filename);
        },
        error: () => {
          this.isDownloading = false;
          this.toast.error('The PDF could not be downloaded. Please try again.');
        }
      });
    }
  }

  markPaid() {
    if (this.bill) {
      this.billService.markAsPaid(this.bill.id).subscribe({
        next: updated => {
          if (updated) {
            this.bill = updated;
          }
          this.toast.success('Invoice marked as paid.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Could not mark the invoice as paid.')
      });
    }
  }

  deleteBill() {
    if (!this.bill || !confirm(`Are you sure you want to delete Invoice #${this.bill.id}?`)) return;
    this.billService.deleteBill(this.bill.id).subscribe({
      next: () => {
        this.toast.success('Invoice deleted.');
        this.router.navigate(['/bills'], { queryParams: { scope: 'sent' } });
      },
      error: (err) => this.toast.error(err.error?.message || 'Could not delete the invoice.')
    });
  }

  /** Copies the backend-built URL as-is, so the copied link always matches the emailed one */
  copyPublicLink() {
    if (!this.bill || this.isCopying) return;
    this.isCopying = true;
    this.billService.getShareLink(this.bill.id).subscribe({
      next: link => {
        this.isCopying = false;
        this.bill!.publicUrl = link.url;
        navigator.clipboard.writeText(link.url);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      },
      error: (err) => {
        this.isCopying = false;
        this.toast.error(err.error?.message || 'Could not create the public link.');
      }
    });
  }

  onEmailSent() {
    this.emailHistoryRefresh++;
  }
}
