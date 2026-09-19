import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { CustomerService } from '../../../services/customer.service';
import { BillItem } from '../../../models/bill';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-bill-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bill-create.html',
  styleUrl: './bill-create.css'
})
export class BillCreateComponent implements OnInit {
  private billService = inject(BillService);
  private customerService = inject(CustomerService);
  private router = inject(Router);

  customers: Customer[] = [];
  customerName = '';
  selectedCustomerId = '';
  dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  status: 'PENDING' | 'PAID' = 'PENDING';
  gstRate = 18;
  isInterState = false;
  placeOfSupply = 'Karnataka (29)';
  customerGstin = '';
  notes = 'Payment terms: Net 14 days. Settle via UPI (billing@sbi) or Net Banking. Thank you for your business!';

  items: BillItem[] = [
    { name: 'Cloud Infrastructure Architecture & Security Consulting', hsnSac: '998314', quantity: 1, price: 65000 }
  ];

  ngOnInit() {
    this.customerService.getCustomers().subscribe(custs => {
      this.customers = custs;
      if (custs.length > 0) {
        this.selectedCustomerId = custs[0].id;
        this.customerName = custs[0].name;
        this.customerGstin = custs[0].gstin || '29AAACI4321A1ZG';
        this.placeOfSupply = `${custs[0].state || 'Karnataka'} (${custs[0].stateCode || '29'})`;
        this.isInterState = (custs[0].stateCode || '29') !== '29';
      }
    });
  }

  onCustomerSelect(id: string) {
    this.selectedCustomerId = id;
    const cust = this.customers.find(c => c.id === id);
    if (cust) {
      this.customerName = cust.name;
      this.customerGstin = cust.gstin || '';
      this.placeOfSupply = `${cust.state || 'Karnataka'} (${cust.stateCode || '29'})`;
      this.isInterState = (cust.stateCode || '29') !== '29';
    }
  }

  addItem() {
    this.items.push({ name: '', hsnSac: '998314', quantity: 1, price: 0 });
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
  }

  calculateTax(): number {
    return Math.round(this.calculateSubtotal() * (this.gstRate / 100) * 100) / 100;
  }

  calculateCGST(): number {
    return this.isInterState ? 0 : Math.round((this.calculateTax() / 2) * 100) / 100;
  }

  calculateSGST(): number {
    return this.isInterState ? 0 : Math.round((this.calculateTax() / 2) * 100) / 100;
  }

  calculateIGST(): number {
    return this.isInterState ? this.calculateTax() : 0;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  saveBill() {
    if (!this.customerName.trim()) {
      alert('Please enter or select a customer name.');
      return;
    }

    const newBill = {
      customerId: this.selectedCustomerId || 'CUST-001',
      customerName: this.customerName,
      customerGstin: this.customerGstin,
      placeOfSupply: this.placeOfSupply,
      isInterState: this.isInterState,
      gstRate: this.gstRate,
      cgst: this.calculateCGST(),
      sgst: this.calculateSGST(),
      igst: this.calculateIGST(),
      items: this.items,
      subtotal: this.calculateSubtotal(),
      tax: this.calculateTax(),
      total: this.calculateTotal(),
      status: this.status,
      dueDate: this.dueDate,
      notes: this.notes
    };

    this.billService.createBill(newBill).subscribe(() => {
      this.router.navigate(['/bills']);
    });
  }
}