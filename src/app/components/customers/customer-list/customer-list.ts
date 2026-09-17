import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
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

  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchQuery = '';

  ngOnInit() {
    this.customerService.getCustomers().subscribe(custs => {
      this.allCustomers = custs;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = [...this.allCustomers];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredCustomers = this.allCustomers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to remove this customer record?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.allCustomers = this.allCustomers.filter(c => c.id !== id);
        this.applyFilter();
      });
    }
  }
}