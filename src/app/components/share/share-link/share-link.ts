import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { API_BASE_URL } from '../../../services/api.config';
import { BillService } from '../../../services/bill.service';
import { ToastService } from '../../../services/toast.service';
import { Bill } from '../../../models/bill';

export interface ShareLinkEntry {
  client: string;
  invoice: string;
  date: string;
  url: string;
  status: string;
}

@Component({
  selector: 'app-share-link',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './share-link.html',
  styleUrl: './share-link.css'
})
export class ShareLinkComponent implements OnInit {
  private http = inject(HttpClient);
  private billService = inject(BillService);
  private toast = inject(ToastService);

  bills: Bill[] = [];
  selectedBillId = '';
  isGenerating = false;

  shareLink = '';
  copied = false;
  allowPayment = true;
  allowDownload = true;
  requireEmail = false;

  activeLinks: ShareLinkEntry[] = [];

  // QR cells are populated from API
  qrCells: boolean[] = [];

  ngOnInit() {
    this.http.get<ShareLinkEntry[]>(`${API_BASE_URL}/share/links`).subscribe(links => {
      this.activeLinks = links;
    });

    // Only the issuer can create a link, so offer the bills this user sent
    this.billService.getBills({ scope: 'sent' }).subscribe(bills => {
      this.bills = bills;
    });
  }

  copyLink() {
    if (!this.shareLink) return;
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    setTimeout(() => this.copied = false, 2500);
  }

  copySpecificLink(url: string) {
    navigator.clipboard.writeText('https://' + url);
  }

  /** Same link the bill view copies and the email contains; the backend builds the absolute URL */
  generateNewLink() {
    if (!this.selectedBillId || this.isGenerating) return;
    this.isGenerating = true;
    this.billService.getShareLink(this.selectedBillId)
      .pipe(finalize(() => { this.isGenerating = false; }))
      .subscribe({
        next: res => {
          this.shareLink = res.url;
          this.copyLink();
        },
        error: (err) => this.toast.error(err.error?.message || 'Could not create the link. Please try again.')
      });
  }
}
