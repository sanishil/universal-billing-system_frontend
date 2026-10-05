import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-public-bill-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-bill-view.html',
  styleUrl: './public-bill-view.css'
})
export class PublicBillViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private billService = inject(BillService);

  bill: Bill | null = null;
  isLoading = true;
  notFound = false;
  paidSuccess = false;

  ngOnInit() {
    const uniqueId = this.route.snapshot.paramMap.get('uniqueId') || '';
    this.billService.getBillByUniqueLink(uniqueId).subscribe({
      next: b => {
        this.bill = b;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  simulateUpiPay() {
    if (this.bill) {
      this.billService.markAsPaid(this.bill.id).subscribe(updated => {
        if (updated) {
          this.bill = updated;
        }
        this.paidSuccess = true;
      });
    }
  }

  printInvoice() {
    window.print();
  }
}
