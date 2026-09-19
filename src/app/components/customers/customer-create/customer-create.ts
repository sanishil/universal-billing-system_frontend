import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

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

  customer = {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    pan: '',
    state: 'Karnataka',
    stateCode: '29'
  };

  saveCustomer() {
    if (!this.customer.name.trim() || !this.customer.email.trim()) {
      alert('Please provide at least a customer name and email.');
      return;
    }

    this.customerService.createCustomer(this.customer).subscribe(() => {
      this.router.navigate(['/customers']);
    });
  }
}