import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-100 dark:bg-black min-h-screen transition-colors">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between mb-6">
          <h1 class="text-2xl font-bold text-black dark:text-white">PDF Preview</h1>
          <button class="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg">Download PDF</button>
        </div>
        <div class="bg-white p-12 shadow-lg rounded-lg min-h-[800px]">
          <!-- Mock PDF Content -->
          <div class="flex justify-between border-b-2 border-black pb-4 mb-8">
            <h2 class="text-4xl font-bold">INVOICE</h2>
            <div class="text-right"><p class="font-bold">Universal Billing</p><p class="text-gray-500">123 Business Rd</p></div>
          </div>
          <div class="mb-8"><p class="font-bold">Bill To:</p><p>John Doe</p><p class="text-gray-500">john@example.com</p></div>
          <table class="w-full mb-8">
            <thead class="border-b border-gray-300"><tr><th class="text-left py-2">Item</th><th class="text-right py-2">Qty</th><th class="text-right py-2">Price</th></tr></thead>
            <tbody><tr><td class="py-2">Web Service</td><td class="text-right">1</td><td class="text-right">$1000</td></tr></tbody>
          </table>
          <div class="text-right text-2xl font-bold">Total: $1000.00</div>
        </div>
      </div>
    </div>
  `
})
export class PdfPreviewComponent {}