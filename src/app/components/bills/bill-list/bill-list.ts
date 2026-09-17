import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.css'
})
export class BillListComponent implements OnInit {
  private billService = inject(BillService);

  allBills: Bill[] = [];
  filteredBills: Bill[] = [];
  searchQuery = '';
  selectedStatus = 'ALL';

  ngOnInit() {
    this.billService.getBills().subscribe(bills => {
      this.allBills = bills;
      this.applyFilter();
    });
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
        b.customerName.toLowerCase().includes(q)
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
      this.billService.deleteBill(id).subscribe(() => {
        this.allBills = this.allBills.filter(b => b.id !== id);
        this.applyFilter();
      });
    }
  }
}