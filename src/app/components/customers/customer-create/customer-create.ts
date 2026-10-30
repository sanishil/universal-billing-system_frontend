import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { SettingsService } from '../../../services/settings.service';
import { Business } from '../../../models/business';
import { ToastService } from '../../../services/toast.service';
import { INDIAN_STATES } from '../../../shared/utils/indian-states';

@Component({
  selector: 'app-customer-create',
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
  // The app runs without zone.js, so HTTP responses don't re-render on their own
  private cdr = inject(ChangeDetectorRef);

  /** Full Indian state list with GST state codes */
  readonly states = INDIAN_STATES;

  customer = {
    name: '',
    company: '',
    /** One of the creator's own businesses, managed in Profile Settings */
    businessId: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    pan: '',
    state: '',
    stateCode: ''
  };

  /** Invite the customer to set a password so they can see the bills sent to them */
  giveLogin = true;

  isLoading = false;

  businesses: Business[] = [];
  businessesLoaded = false;

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

  /** Auto-update stateCode whenever state selection changes */
  onStateChange(stateName: string): void {
    const found = this.states.find(s => s.name === stateName);
    this.customer.stateCode = found ? found.code : '';
  }

  saveCustomer(): void {
    if (!this.customer.name.trim()) {
      this.toast.error('Please provide the customer\'s full name.');
      return;
    }
    const business = this.businesses.find(b => b.id === this.customer.businessId);
    if (!business) {
      this.toast.error('Please choose which of your businesses this customer belongs to.');
      return;
    }
    if (this.giveLogin && !this.customer.email.trim()) {
      this.toast.error('An email address is needed to give this customer a login.');
      return;
    }

    this.isLoading = true;
    this.customerService.createCustomer({ ...this.customer, company: business.name, inviteRecipient: this.giveLogin }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success(this.giveLogin
          ? 'Customer created. They\'ll get a login invite with their first bill.'
          : 'Customer created successfully!');
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        const msg =
          err.error?.message ||
          err.error?.errors?.[0]?.message ||
          'Failed to save customer. Please try again.';
        this.toast.error(msg);
      }
    });
  }
}
