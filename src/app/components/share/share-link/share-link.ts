import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_BASE_URL } from '../../../services/api.config';

export interface ShareLinkEntry {
  client: string;
  invoice: string;
  date: string;
  url: string;
  status: string;
}

export interface GeneratedLink {
  url: string;
  qrCells: boolean[];
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

  generateNewLink() {
    this.http.post<GeneratedLink>(`${API_BASE_URL}/share/generate`, {
      allowPayment: this.allowPayment,
      allowDownload: this.allowDownload,
      requireEmail: this.requireEmail
    }).subscribe(res => {
      this.shareLink = res.url;
      this.qrCells = res.qrCells || [];
      this.copyLink();
    });
  }
}
