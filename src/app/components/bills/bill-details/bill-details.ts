import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { Bill, isIssuer } from '../../../models/bill';

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

  get isIssuer(): boolean {
    return !!this.bill && isIssuer(this.bill);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.billService.getBillById(id).subscribe(b => {
      this.bill = b || null;
    });
  }
}
