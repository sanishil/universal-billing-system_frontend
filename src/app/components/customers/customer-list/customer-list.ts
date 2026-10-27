import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private toast = inject(ToastService);

  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchQuery = '';
  isLoading = true;
  errorMessage = '';
  deletingId: string | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({
      next: (custs) => {
        this.allCustomers = custs;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Unable to reach the server. Please check your connection and try again.';
          return;
        }
        const backendMsg = err.error?.message || err.error?.error;
        this.errorMessage = backendMsg
          ? `Could not load customers: ${backendMsg}`
          : `Could not load customers (HTTP ${err.status}). Please try again.`;
      }
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredCustomers = [...this.allCustomers];
      return;
    }
    this.filteredCustomers = this.allCustomers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  }

  deleteCustomer(id: string): void {
    if (this.deletingId) return;
    if (!confirm('Are you sure you want to remove this customer record?')) return;

    this.deletingId = id;
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.allCustomers = this.allCustomers.filter(c => c.id !== id);
        this.applyFilter();
        this.toast.success('Customer removed successfully.');
      },
      error: (err) => {
        this.deletingId = null;
        this.toast.error(err.error?.message || 'Failed to delete customer. Please try again.');
      }
    });
  }
}
