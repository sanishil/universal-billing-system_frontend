import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BillService } from '../../../services/bill.service';
import { AuthService } from '../../../services/auth.service';
import { DEFAULT_GST_RATES, SettingsService } from '../../../services/settings.service';
import { ToastService } from '../../../services/toast.service';
import { Bill } from '../../../models/bill';
import { GstBreakdown, calculateGst, stateCodeFromPlaceOfSupply } from '../../../shared/utils/gst-calculator';
import { GstRateSelectComponent } from '../../shared/gst-rate-select/gst-rate-select';

@Component({
  selector: 'app-bill-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GstRateSelectComponent],
  templateUrl: './bill-edit.html',
  styleUrl: './bill-edit.css'
})
export class BillEditComponent implements OnInit {
  private billService = inject(BillService);
  private authService = inject(AuthService);
  private settingsService = inject(SettingsService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  billId = '';
  bill: Bill | null = null;
  isLoading = true;
  notFound = false;
  isSaving = false;
  gstRates: number[] = DEFAULT_GST_RATES;

  /** Supplier state snapshotted on the bill; older bills fall back to the current profile */
  private supplierStateCode = '';
  private placeOfSupplyCode = '';

  get gst(): GstBreakdown {
    return calculateGst(this.bill?.items ?? [], this.bill?.gstRate ?? null, this.supplierStateCode, this.placeOfSupplyCode);
  }

  ngOnInit() {
    this.billId = this.route.snapshot.paramMap.get('id') || '';
    this.billService.getBillById(this.billId).subscribe({
      next: found => {
        // Deep copy to prevent accidental live mutation until saved
        this.bill = JSON.parse(JSON.stringify(found)) as Bill;
        // Bills saved before optional GST have no gstRate; they were 18%
        if (this.bill.gstRate === undefined) this.bill.gstRate = 18;

        this.placeOfSupplyCode = this.bill.stateCode || stateCodeFromPlaceOfSupply(this.bill.placeOfSupply);
        this.supplierStateCode =
          this.bill.supplierStateCode ||
          this.authService.getCurrentUser()?.stateCode ||
          // Last resort: keep the bill's existing intra/inter-state treatment
          (this.bill.isInterState ? '' : this.placeOfSupplyCode);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });

    this.settingsService.getSystemSettings().subscribe({
      next: s => { if (s.gstRates?.length) this.gstRates = s.gstRates; },
      error: () => {}
    });
  }

  addItem() {
    if (this.bill) {
      this.bill.items.push({ name: '', hsnSac: '998314', quantity: 1, price: 0 });
    }
  }

  removeItem(index: number) {
    if (this.bill && this.bill.items.length > 1) {
      this.bill.items.splice(index, 1);
    }
  }

  saveBill() {
    if (!this.bill) return;

    const gst = this.gst;
    this.bill.subtotal = gst.subtotal;
    this.bill.tax = gst.taxTotal;
    this.bill.cgst = gst.cgst;
    this.bill.sgst = gst.sgst;
    this.bill.igst = gst.igst;
    this.bill.isInterState = gst.interState;
    this.bill.total = gst.total;

    this.isSaving = true;
    this.billService.updateBill(this.bill.id, this.bill)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          this.toast.success('Invoice updated.');
          this.router.navigate(['/bills/view', this.bill!.id]);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update the invoice. Please try again.');
        }
      });
  }

  cancel() {
    this.router.navigate(['/bills/view', this.billId]);
  }
}
