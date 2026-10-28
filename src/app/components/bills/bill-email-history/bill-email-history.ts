import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillEmailLog } from '../../../models/bill-email';
import { BillService } from '../../../services/bill.service';

/** Emails sent for one bill, shown inside bill-view. Bump `refresh` to reload. */
@Component({
  selector: 'app-bill-email-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-email-history.html',
  styleUrl: './bill-email-history.css'
})
export class BillEmailHistoryComponent implements OnChanges {
  private billService = inject(BillService);

  @Input({ required: true }) billId!: string;
  @Input() refresh = 0;

  emails: BillEmailLog[] = [];
  isLoading = true;
  loadFailed = false;

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.loadFailed = false;
    this.billService.getEmails(this.billId).subscribe({
      next: emails => {
        this.emails = emails;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loadFailed = true;
      }
    });
  }

  badgeClass(status: BillEmailLog['status']): string {
    if (status === 'SENT') return 'ubs-badge-paid';
    if (status === 'FAILED') return 'ubs-badge-overdue';
    return 'ubs-badge-pending';
  }
}
