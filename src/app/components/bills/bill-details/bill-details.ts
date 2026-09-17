import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bill-details.html',
  styleUrl: './bill-details.css'
})
export class BillDetailsComponent implements OnInit {
  private billService = inject(BillService);
  private route = inject(ActivatedRoute);

  bill: Bill | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'INV-2026-001';
    this.billService.getBillById(id).subscribe(b => {
      this.bill = b || null;
    });
  }
}
