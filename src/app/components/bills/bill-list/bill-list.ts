import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillService } from '../../../services/bill.service';
import { ToastService } from '../../../services/toast.service';
import { Bill, BillScope, isIssuer } from '../../../models/bill';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.css'
})
export class BillListComponent implements OnInit {
  private billService = inject(BillService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  /** Bound to ?scope= so sidebar and notification links can open either tab */
  scope: BillScope = 'sent';
  allBills: Bill[] = [];
  filteredBills: Bill[] = [];
  searchQuery = '';
  selectedStatus = 'ALL';
  isLoading = true;

  readonly isIssuer = isIssuer;

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.scope = params.get('scope') === 'received' ? 'received' : 'sent';
        this.loadBills();
      });
  }

  loadBills() {
    this.isLoading = true;
    this.allBills = [];
    this.applyFilter();
    this.billService.getBills({ scope: this.scope }).subscribe({
      next: bills => {
        this.allBills = bills;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Invoices could not be loaded. Please try again.');
      }
    });
  }

  setScope(scope: BillScope) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { scope } });
  }

  /** Received rows show who the bill is from */
  issuerName(bill: Bill): string {
    return bill.issuer?.businessName || bill.issuer?.name || '—';
  }

  applyFilter() {
    let result = [...this.allBills];

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(b => b.status === this.selectedStatus);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        this.issuerName(b).toLowerCase().includes(q)
      );
    }

    this.filteredBills = result;
  }

  onSearchChange() {
    this.applyFilter();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.applyFilter();
  }

  deleteBill(id: string) {
    if (confirm(`Are you sure you want to delete Invoice #${id}?`)) {
      this.billService.deleteBill(id).subscribe({
        next: () => {
          this.allBills = this.allBills.filter(b => b.id !== id);
          this.applyFilter();
          this.toast.success('Invoice deleted.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Could not delete the invoice.')
      });
    }
  }
}
