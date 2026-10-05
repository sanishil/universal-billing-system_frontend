import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { BillService } from '../../../services/bill.service';
import { Customer } from '../../../models/customer';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css'
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private billService = inject(BillService);

  customer: Customer | null = null;
  customerBills: Bill[] = [];
  isLoading = true;
  notFound = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.customerService.getCustomerById(id).subscribe({
      next: cust => {
        this.customer = cust;
        this.isLoading = false;
        this.billService.getBills().subscribe(bills => {
          this.customerBills = bills.filter(b => b.customerId === id || b.customerName === cust.name);
        });
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }
}
