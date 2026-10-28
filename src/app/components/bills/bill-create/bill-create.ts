import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BillService } from '../../../services/bill.service';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { DEFAULT_GST_RATES, SettingsService } from '../../../services/settings.service';
import { ToastService } from '../../../services/toast.service';
import { BillItem, BillRequest } from '../../../models/bill';
import { Customer } from '../../../models/customer';
import { GstBreakdown, calculateGst } from '../../../shared/utils/gst-calculator';
import { INDIAN_STATES, stateNameForCode } from '../../../shared/utils/indian-states';
import { GstRateSelectComponent } from '../../shared/gst-rate-select/gst-rate-select';

@Component({
  selector: 'app-bill-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GstRateSelectComponent],
  templateUrl: './bill-create.html',
  styleUrl: './bill-create.css'
})
export class BillCreateComponent implements OnInit {
  private billService = inject(BillService);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private settingsService = inject(SettingsService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly states = INDIAN_STATES;

  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  customerName = '';
  selectedCustomerId = '';
  dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  status: 'PENDING' | 'PAID' = 'PENDING';

  /** Issuer's state from their profile; bills can't be issued without it */
  supplierStateCode = this.authService.getCurrentUser()?.stateCode ?? '';
  placeOfSupplyCode = this.supplierStateCode;

  /** null = No GST */
  gstRate: number | null = 18;
  gstRates: number[] = DEFAULT_GST_RATES;

  sendEmail = false;
  inviteRecipient = true;
  isSaving = false;

  customerGstin = '';
  notes = 'Payment terms: Net 14 days. Settle via UPI (billing@sbi) or Net Banking. Thank you for your business!';
  items: BillItem[] = [
    { name: '', hsnSac: '998314', quantity: 1, price: 0 }
  ];

  get profileIncomplete(): boolean {
    return !this.supplierStateCode;
  }

  get gst(): GstBreakdown {
    // Until the profile has a state, preview as intra-state
    return calculateGst(this.items, this.gstRate, this.supplierStateCode || this.placeOfSupplyCode, this.placeOfSupplyCode);
  }

  get placeOfSupply(): string {
    return `${stateNameForCode(this.placeOfSupplyCode)} (${this.placeOfSupplyCode})`;
  }

  /** The login invite only makes sense for customers with an email and no account yet */
  get canInviteRecipient(): boolean {
    return !!this.selectedCustomer?.email && this.selectedCustomer.accountStatus !== 'REGISTERED';
  }

  ngOnInit() {
    // "+ Bill" on the customer list passes ?customerId= to preselect that customer
    const preselectId = this.route.snapshot.queryParamMap.get('customerId');
    this.customerService.getCustomers().subscribe(custs => {
      this.customers = custs;
      const initial = custs.find(c => c.id === preselectId) ?? custs[0];
      if (initial) {
        this.onCustomerSelect(initial.id);
      }
    });

    this.settingsService.getSystemSettings().subscribe({
      next: s => {
        if (s.gstRates?.length) this.gstRates = s.gstRates;
        if (s.defaultGstRate !== undefined) this.gstRate = s.defaultGstRate;
        this.sendEmail = !!s.autoEmailOnCreate;
      },
      // Keep the built-in defaults if settings can't be loaded
      error: () => {}
    });
  }

  onCustomerSelect(id: string) {
    this.selectedCustomerId = id;
    const cust = this.customers.find(c => c.id === id);
    this.selectedCustomer = cust ?? null;
    if (cust) {
      this.customerName = cust.name;
      this.customerGstin = cust.gstin || '';
      this.placeOfSupplyCode = cust.stateCode || this.supplierStateCode;
      this.inviteRecipient = this.canInviteRecipient;
    }
  }

  addItem() {
    this.items.push({ name: '', hsnSac: '998314', quantity: 1, price: 0 });
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  saveBill() {
    if (this.profileIncomplete) {
      this.toast.error('Add your business state in Profile settings before issuing bills.');
      return;
    }
    if (!this.selectedCustomerId || !this.customerName.trim()) {
      this.toast.error('Please select a customer.');
      return;
    }

    const gst = this.gst;
    const newBill: BillRequest = {
      customerId: this.selectedCustomerId,
      customerName: this.customerName,
      customerGstin: this.customerGstin,
      placeOfSupply: this.placeOfSupply,
      stateCode: this.placeOfSupplyCode,
      isInterState: gst.interState,
      // Sent as-is: null means No GST and must not become 0
      gstRate: this.gstRate,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      items: this.items,
      subtotal: gst.subtotal,
      tax: gst.taxTotal,
      total: gst.total,
      status: this.status,
      dueDate: this.dueDate,
      notes: this.notes,
      sendEmail: this.sendEmail,
      inviteRecipient: this.canInviteRecipient && this.inviteRecipient
    };

    this.isSaving = true;
    this.billService.createBill(newBill)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          this.toast.success(this.sendEmail ? 'Invoice issued and queued for email.' : 'Invoice issued.');
          this.router.navigate(['/bills'], { queryParams: { scope: 'sent' } });
        },
        error: (err) => {
          const msg =
            err.error?.message ||
            err.error?.errors?.[0]?.message ||
            'Failed to issue the invoice. Please try again.';
          this.toast.error(msg);
        }
      });
  }
}
