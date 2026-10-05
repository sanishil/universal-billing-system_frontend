import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { Bill, BillItem } from '../../../models/bill';

@Component({
  selector: 'app-bill-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bill-edit.html',
  styleUrl: './bill-edit.css'
})
export class BillEditComponent implements OnInit {
  private billService = inject(BillService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  billId = '';
  bill: Bill | null = null;
  isLoading = true;
  notFound = false;

  ngOnInit() {
    this.billId = this.route.snapshot.paramMap.get('id') || '';
    this.billService.getBillById(this.billId).subscribe({
      next: found => {
        // Deep copy to prevent accidental live mutation until saved
        this.bill = JSON.parse(JSON.stringify(found));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  addItem() {
    if (this.bill) {
      this.bill.items.push({ name: '', hsnSac: '998314', quantity: 1, price: 0 });
    }
  }

  removeItem(index: number) {
    if (this.bill && this.bill.items.length > 1) {
      this.bill.items.splice(index, 1);
    }
  }

  calculateSubtotal(): number {
    if (!this.bill?.items) return 0;
    return this.bill.items.reduce((sum: number, item: BillItem) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
  }

  calculateTax(): number {
    const rate = this.bill?.gstRate !== undefined ? this.bill.gstRate : 18;
    return Math.round(this.calculateSubtotal() * (rate / 100) * 100) / 100;
  }

  calculateCGST(): number {
    if (this.bill?.isInterState) return 0;
    return Math.round((this.calculateTax() / 2) * 100) / 100;
  }

  calculateSGST(): number {
    if (this.bill?.isInterState) return 0;
    return Math.round((this.calculateTax() / 2) * 100) / 100;
  }

  calculateIGST(): number {
    if (!this.bill?.isInterState) return 0;
    return this.calculateTax();
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  saveBill() {
    if (!this.bill) return;

    this.bill.subtotal = this.calculateSubtotal();
    this.bill.tax = this.calculateTax();
    this.bill.cgst = this.calculateCGST();
    this.bill.sgst = this.calculateSGST();
    this.bill.igst = this.calculateIGST();
    this.bill.total = this.calculateTotal();

    this.billService.updateBill(this.bill.id, this.bill).subscribe(() => {
      this.router.navigate(['/bills/view', this.bill!.id]);
    });
  }

  cancel() {
    this.router.navigate(['/bills/view', this.billId]);
  }
}
