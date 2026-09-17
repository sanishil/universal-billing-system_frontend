import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-link',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">Share Bill Link</h1>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public Link</label>
          <div class="flex">
            <input [value]="shareLink" readonly class="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white outline-none">
            <button (click)="copyLink()" class="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-r-lg hover:opacity-90 transition">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">This link is permanent and does not require the customer to log in.</p>
        </div>
      </div>
    </div>
  `
})
export class ShareLinkComponent {
  shareLink = 'https://universalbilling.com/bill/view/abc-123-xyz';
  copied = false;
  copyLink() {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}