import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-link',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './share-link.html',
  styleUrl: './share-link.css'
})
export class ShareLinkComponent {
  shareLink = 'https://universalbilling.com/bill/view/abc-123-xyz';
  copied = false;
  allowPayment = true;
  allowDownload = true;
  requireEmail = false;

  activeLinks = [
    { client: 'Rajesh Kumar Enterprises', invoice: 'INV-001', date: '21 Sep 2026', url: 'ubill.in/v/rkent-001', status: 'paid' },
    { client: 'Priya Nair Technologies', invoice: 'INV-002', date: '20 Sep 2026', url: 'ubill.in/v/pnt-002', status: 'pending' },
    { client: 'Mehta & Sons Pvt. Ltd', invoice: 'INV-003', date: '18 Sep 2026', url: 'ubill.in/v/ms-003', status: 'pending' },
    { client: 'Ravi Shankar Exports', invoice: 'INV-004', date: '15 Sep 2026', url: 'ubill.in/v/rse-004', status: 'paid' },
  ];

  // QR Code mock pattern (81 cells, 9×9)
  qrCells: boolean[] = [
    true,true,true,true,true,true,true,false,true,
    true,false,false,false,false,false,true,false,false,
    true,false,true,true,true,false,true,false,true,
    true,false,true,true,true,false,true,false,true,
    true,false,true,true,true,false,true,false,false,
    true,false,false,false,false,false,true,false,true,
    true,true,true,true,true,true,true,false,true,
    false,false,false,false,false,false,false,false,false,
    true,false,true,false,true,true,false,true,false,
  ];

  copyLink() {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    setTimeout(() => this.copied = false, 2500);
  }

  copySpecificLink(url: string) {
    navigator.clipboard.writeText('https://' + url);
  }

  generateNewLink() {
    const id = Math.random().toString(36).substring(2, 10);
    this.shareLink = `https://universalbilling.com/bill/view/${id}`;
    this.copyLink();
  }
}