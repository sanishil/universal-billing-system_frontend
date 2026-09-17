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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'CUST-001';
    this.customerService.getCustomerById(id).subscribe(cust => {
      if (cust) {
        this.customer = cust;
      } else {
        this.customer = {
          id,
          name: 'Acme Global Technologies',
          email: 'billing@acmeglobal.tech',
          phone: '+1 (555) 234-5678',
          address: '742 Evergreen Terrace, Suite 400, Silicon Valley, CA 94025',
          company: 'Acme Corp Group',
          totalSpent: 12850,
          billsCount: 5,
          status: 'ACTIVE'
        };
      }

      this.billService.getBills().subscribe(bills => {
        this.customerBills = bills.filter(b => b.customerId === id || b.customerName === this.customer?.name);
      });
    });
  }
}