import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { BillService } from '../../../services/bill.service';
import { Customer } from '../../../models/customer';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-customer-details',
  changeDetection: ChangeDetectionStrategy.Eager,
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
        this.billService.getBills({ scope: 'sent', customerId: id }).subscribe(bills => {
          // The backend filters by customerId; the check keeps older backends that ignore it correct
          this.customerBills = bills.filter(b => b.customerId === id);
        });
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  /** Up to two initials for the avatar, e.g. "Ravi Kumar" → "RK" */
  get initials(): string {
    const parts = (this.customer?.name || '').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('') || '?';
  }

  get paidTotal(): number {
    return this.sumBills(b => b.status === 'PAID');
  }

  get outstandingTotal(): number {
    return this.sumBills(b => b.status !== 'PAID');
  }

  /** Backend value when it sends one, otherwise what this customer has paid so far */
  get lifetimeValue(): number {
    return this.customer?.totalSpent ?? this.paidTotal;
  }

  get overdueCount(): number {
    return this.customerBills.filter(b => b.status === 'OVERDUE').length;
  }

  private sumBills(match: (b: Bill) => boolean): number {
    return this.customerBills.filter(match).reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  }
}
