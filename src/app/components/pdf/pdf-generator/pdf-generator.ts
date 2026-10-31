import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BillService } from '../../../services/bill.service';
import { ToastService } from '../../../services/toast.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pdf-generator.html',
  styleUrl: './pdf-generator.css'
})
export class PdfGeneratorComponent implements OnInit {
  private billService = inject(BillService);
  private toast = inject(ToastService);
  private router = inject(Router);
  // The app runs without zone.js, so HTTP responses don't re-render on their own
  private cdr = inject(ChangeDetectorRef);

  bills: Bill[] = [];
  billsLoaded = false;
  selectedBillId = '';
  isEmailing = false;

  get selectedBill(): Bill | undefined {
    return this.bills.find(b => b.id === this.selectedBillId);
  }

  ngOnInit() {
    this.billService.getBills({ scope: 'sent' })
      .pipe(finalize(() => { this.billsLoaded = true; this.cdr.markForCheck(); }))
      .subscribe({
        next: bills => this.bills = bills,
        error: () => this.toast.error('Your invoices could not be loaded.')
      });
  }

  /** The invoice page has Print / Save as PDF */
  openInvoice() {
    if (!this.selectedBillId) return;
    this.router.navigate(['/bills/view', this.selectedBillId]);
  }

  emailInvoice() {
    const bill = this.selectedBill;
    if (!bill) return;

    this.isEmailing = true;
    this.billService.sendEmail(bill.id, {})
      .pipe(finalize(() => { this.isEmailing = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: res => res.status === 'FAILED'
          ? this.toast.error('The email could not be sent. Please check the mail settings and try again.')
          : this.toast.success(`Invoice ${bill.id} emailed to ${bill.customerName}.`),
        error: (err) => this.toast.error(err.error?.message || 'The email could not be sent. Please try again.')
      });
  }
}
