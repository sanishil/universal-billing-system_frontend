import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';

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
  readonly states: { name: string; code: string }[] = [
    { name: 'Andaman and Nicobar Islands', code: '35' },
    { name: 'Andhra Pradesh', code: '37' },
    { name: 'Arunachal Pradesh', code: '12' },
    { name: 'Assam', code: '18' },
    { name: 'Bihar', code: '10' },
    { name: 'Chandigarh', code: '04' },
    { name: 'Chhattisgarh', code: '22' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: '26' },
    { name: 'Delhi', code: '07' },
    { name: 'Goa', code: '30' },
    { name: 'Gujarat', code: '24' },
    { name: 'Haryana', code: '06' },
    { name: 'Himachal Pradesh', code: '02' },
    { name: 'Jammu and Kashmir', code: '01' },
    { name: 'Jharkhand', code: '20' },
    { name: 'Karnataka', code: '29' },
    { name: 'Kerala', code: '32' },
    { name: 'Ladakh', code: '38' },
    { name: 'Lakshadweep', code: '31' },
    { name: 'Madhya Pradesh', code: '23' },
    { name: 'Maharashtra', code: '27' },
    { name: 'Manipur', code: '14' },
    { name: 'Meghalaya', code: '17' },
    { name: 'Mizoram', code: '15' },
    { name: 'Nagaland', code: '13' },
    { name: 'Odisha', code: '21' },
    { name: 'Puducherry', code: '34' },
    { name: 'Punjab', code: '03' },
    { name: 'Rajasthan', code: '08' },
    { name: 'Sikkim', code: '11' },
    { name: 'Tamil Nadu', code: '33' },
    { name: 'Telangana', code: '36' },
    { name: 'Tripura', code: '16' },
    { name: 'Uttar Pradesh', code: '09' },
    { name: 'Uttarakhand', code: '05' },
    { name: 'West Bengal', code: '19' },
  ];

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
    if (!this.customer.email.trim()) {
      this.toast.error('Please provide a valid work email address.');
      return;
    }

    this.isLoading = true;
    this.customerService.createCustomer(this.customer).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Customer created successfully!');
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