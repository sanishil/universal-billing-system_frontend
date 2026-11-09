import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomerLookup, CustomerService } from '../../../services/customer.service';
import { SettingsService } from '../../../services/settings.service';
import { Business } from '../../../models/business';
import { ToastService } from '../../../services/toast.service';
import { INDIAN_STATES } from '../../../shared/utils/indian-states';

// Same rules the backend applies
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const GSTIN_PATTERN = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

type FieldErrors = Partial<Record<'name' | 'businessId' | 'email' | 'phone' | 'gstin' | 'pan' | 'stateCode', string>>;

@Component({
  selector: 'app-customer-create',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-create.html',
  styleUrl: './customer-create.css'
})
export class CustomerCreateComponent implements OnInit {
  private customerService = inject(CustomerService);
  private settingsService = inject(SettingsService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  /** Full Indian state list with GST state codes */
  readonly states = INDIAN_STATES;

  customer = {
    name: '',
    /** One of the creator's own businesses, managed in Profile Settings */
    businessId: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    pan: '',
    stateCode: ''
  };

  /** Create a login for the customer and email them a temporary password */
  giveLogin = true;

  isLoading = false;
  /** Errors are shown once the user has tried to save */
  submitted = false;

  businesses: Business[] = [];
  businessesLoaded = false;

  /** Result of checking the typed email against the system */
  lookup: CustomerLookup | null = null;
  checkingEmail = false;
  /** The user said yes to adding a customer who is already in the system */
  addExisting = false;
  private checkedEmail = '';

  ngOnInit(): void {
    this.settingsService.getBusinesses().subscribe({
      next: list => {
        this.businesses = list;
        this.businessesLoaded = true;
        // Pre-select the default (first) business
        if (list.length) this.customer.businessId = list[0].id;
        this.cdr.markForCheck();
      },
      error: () => {
        this.businessesLoaded = true;
        this.cdr.markForCheck();
        this.toast.error('Your businesses could not be loaded.');
      }
    });
  }

  get errors(): FieldErrors {
    const c = this.customer;
    const errors: FieldErrors = {};
    const email = c.email.trim();
    const phone = this.normalizePhone(c.phone);

    if (!c.name.trim()) errors.name = 'Enter the customer\'s name.';
    if (!this.businesses.some(b => b.id === c.businessId)) errors.businessId = 'Choose one of your businesses.';

    if (!email && this.giveLogin) errors.email = 'Needed to send the login details.';
    else if (email && !EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email, e.g. rahul.sharma@gmail.com.';
    else if (this.lookup?.status === 'MINE') errors.email = 'This customer is already in your list.';
    else if (this.lookup?.status === 'EXISTS' && !this.addExisting) errors.email = 'Choose whether to add this existing customer.';

    // Someone with their own account needs no new login, so no phone is required for one
    if (!phone && this.giveLogin && !this.lookup?.hasAccount) errors.phone = 'Needed to give this customer a login.';
    else if (phone && !PHONE_PATTERN.test(phone)) errors.phone = 'Enter a 10-digit mobile number, e.g. 9876543210.';

    if (c.gstin && !GSTIN_PATTERN.test(c.gstin)) errors.gstin = 'GSTIN must be 15 characters, e.g. 29AAACI4321A1ZG.';
    if (c.pan && !PAN_PATTERN.test(c.pan)) errors.pan = 'PAN must look like AAACI4321A.';
    if (!c.stateCode) errors.stateCode = 'Select the state — it decides CGST + SGST vs IGST.';
    return errors;
  }

  /** Error text for a field, only after the first save attempt */
  error(field: keyof FieldErrors): string | undefined {
    return this.submitted ? this.errors[field] : undefined;
  }

  /** Typing a different email forgets the previous check */
  onEmailChange(): void {
    if (this.customer.email.trim().toLowerCase() !== this.checkedEmail) {
      this.lookup = null;
      this.addExisting = false;
    }
  }

  /** On leaving the email field: is this customer new, already yours, or known in the system? */
  checkEmail(): void {
    const email = this.customer.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email === this.checkedEmail) return;

    this.checkingEmail = true;
    this.customerService.lookupEmail(email)
      .pipe(finalize(() => { this.checkingEmail = false; }))
      .subscribe({
        next: result => {
          this.checkedEmail = email;
          this.lookup = result.status === 'NEW' ? null : result;
          this.addExisting = false;
        },
        // If the check fails, saving still works; the backend rejects duplicates
        error: () => { this.checkedEmail = ''; }
      });
  }

  confirmAddExisting(): void {
    this.addExisting = true;
    if (!this.customer.name.trim() && this.lookup?.name) this.customer.name = this.lookup.name;
    if (this.lookup?.hasAccount) this.giveLogin = false;
  }

  declineAddExisting(): void {
    this.customer.email = '';
    this.lookup = null;
    this.checkedEmail = '';
    this.addExisting = false;
    document.getElementById('cust-email')?.focus();
  }

  onGstinChange(value: string): void {
    const gstin = value.toUpperCase().replace(/\s/g, '');
    this.customer.gstin = gstin;
    // The first two digits are the state code, characters 3–12 are the PAN
    const fromGstin = this.states.find(s => s.code === gstin.slice(0, 2));
    if (fromGstin) this.customer.stateCode = fromGstin.code;
    if (GSTIN_PATTERN.test(gstin) && !this.customer.pan) this.customer.pan = gstin.slice(2, 12);
  }

  onPanChange(value: string): void {
    this.customer.pan = value.toUpperCase().replace(/\s/g, '');
  }

  saveCustomer(): void {
    if (this.isLoading) return;
    this.submitted = true;
    const firstError = Object.values(this.errors)[0];
    if (firstError) {
      this.toast.error(firstError);
      return;
    }

    const c = this.customer;
    const business = this.businesses.find(b => b.id === c.businessId)!;
    const state = this.states.find(s => s.code === c.stateCode);

    this.isLoading = true;
    this.customerService.createCustomer({
      name: c.name.trim(),
      businessId: business.id,
      company: business.name,
      email: c.email.trim().toLowerCase(),
      phone: this.normalizePhone(c.phone),
      address: c.address.trim(),
      gstin: c.gstin,
      pan: c.pan,
      state: state?.name ?? '',
      stateCode: c.stateCode,
      inviteRecipient: this.giveLogin
    })
      .pipe(finalize(() => { this.isLoading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.toast.success(
            this.lookup?.hasAccount ? 'Customer added. Your bills will show in their own account.'
            : this.giveLogin ? 'Customer created. Their login details have been emailed to them.'
            : 'Customer created.');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          const msg =
            err.error?.message ||
            err.error?.errors?.[0]?.message ||
            'Failed to save customer. Please try again.';
          this.toast.error(msg);
        }
      });
  }

  /** Keeps digits only and drops a leading +91 / 91 / 0 */
  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
  }
}
