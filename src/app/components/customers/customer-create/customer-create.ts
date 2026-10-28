import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';
import { INDIAN_STATES } from '../../../shared/utils/indian-states';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-create.html',
  styleUrl: './customer-create.css'
})
export class CustomerCreateComponent {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private toast = inject(ToastService);

  /** Full Indian state list with GST state codes */
  readonly states = INDIAN_STATES;

  customer = {
    name: '',
    company: '',
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
    if (this.giveLogin && !this.customer.email.trim()) {
      this.toast.error('An email address is needed to give this customer a login.');
      return;
    }

    this.isLoading = true;
    this.customerService.createCustomer({ ...this.customer, inviteRecipient: this.giveLogin }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success(this.giveLogin
          ? 'Customer created. They\'ll get a login invite with their first bill.'
          : 'Customer created successfully!');
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.isLoading = false;
        const msg =
          err.error?.message ||
          err.error?.errors?.[0]?.message ||
          'Failed to save customer. Please try again.';
        this.toast.error(msg);
      }
    });
  }
}
