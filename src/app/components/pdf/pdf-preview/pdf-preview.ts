import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-100 min-h-screen transition-colors">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900">PDF Tax Invoice Preview</h1>
            <p class="text-xs text-gray-500">Standard Indian GST Format (Original for Recipient)</p>
          </div>
          <button (click)="print()" class="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-lg shadow transition">
            Print / Save as PDF
          </button>
        </div>
        <div class="bg-white p-12 shadow-xl rounded-xl border border-gray-200">
          <!-- Tax Invoice Header -->
          <div class="flex justify-between border-b-2 border-purple-900 pb-6 mb-6">
            <div>
              <span class="text-xs font-bold text-purple-900 tracking-wider">TAX INVOICE</span>
              <h2 class="text-2xl font-black text-gray-900">Universal Billing Solutions India Pvt. Ltd.</h2>
              <p class="text-xs text-gray-600 mt-1"><strong>GSTIN:</strong> 29AABCU9603R1ZM | <strong>PAN:</strong> AABCU9603R</p>
              <p class="text-xs text-gray-600">Salarpuria Cyber Towers, HSR Layout, Bengaluru, Karnataka - 560102</p>
              <p class="text-xs text-gray-500">State: Karnataka (Code: 29)</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-gray-500 font-semibold">(Original for Recipient)</span>
              <p class="text-lg font-black text-purple-900 mt-1">#INV-2026-001</p>
              <p class="text-xs text-gray-600">Date: 10 Sep 2026</p>
              <p class="text-xs text-gray-600">Place of Supply: Karnataka (29)</p>
            </div>
          </div>

          <!-- Client details -->
          <div class="grid grid-cols-2 gap-6 mb-6 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
            <div>
              <p class="text-xs font-bold text-purple-900 uppercase">Billed To (Buyer):</p>
              <p class="font-bold text-gray-900 text-sm mt-1">Infosys Digital Systems Ltd.</p>
              <p class="text-xs text-gray-600">Electronics City, Hosur Road, Bengaluru, Karnataka - 560100</p>
              <p class="text-xs text-gray-600 mt-1"><strong>Buyer GSTIN:</strong> 29AAACI4321A1ZG</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-purple-900 uppercase">Payment & Supply Info:</p>
              <p class="text-xs text-gray-700 mt-1">Currency: <strong>INR (₹)</strong></p>
              <p class="text-xs text-gray-700">Supply: <strong>Intra-State (CGST + SGST)</strong></p>
              <p class="text-xs text-gray-700">Payment Due: <strong>24 Sep 2026</strong></p>
            </div>
          </div>

          <!-- Table -->
          <table class="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
              <tr>
                <th class="text-left py-3 px-4">Service Description</th>
                <th class="text-center py-3 px-2">HSN/SAC</th>
                <th class="text-center py-3 px-2">Qty</th>
                <th class="text-right py-3 px-4">Rate (₹)</th>
                <th class="text-right py-3 px-4">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="py-3 px-4 font-medium">Enterprise Cloud Infrastructure & Kubernetes</td>
                <td class="text-center py-3 px-2 font-mono text-xs">998315</td>
                <td class="text-center py-3 px-2">1</td>
                <td class="text-right py-3 px-4">₹85,000.00</td>
                <td class="text-right py-3 px-4 font-semibold">₹85,000.00</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium">24/7 Dedicated Support & SLA Retainer</td>
                <td class="text-center py-3 px-2 font-mono text-xs">998314</td>
                <td class="text-center py-3 px-2">1</td>
                <td class="text-right py-3 px-4">₹45,000.00</td>
                <td class="text-right py-3 px-4 font-semibold">₹45,000.00</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium">Security Cert & Vulnerability Audit</td>
                <td class="text-center py-3 px-2 font-mono text-xs">998316</td>
                <td class="text-center py-3 px-2">2</td>
                <td class="text-right py-3 px-4">₹12,500.00</td>
                <td class="text-right py-3 px-4 font-semibold">₹25,000.00</td>
              </tr>
            </tbody>
          </table>

          <!-- Amount in Words & Totals -->
          <div class="grid grid-cols-2 gap-6 items-end pt-4 border-t border-gray-200">
            <div>
              <div class="bg-purple-50 border-l-4 border-purple-900 p-3 rounded">
                <p class="text-xs font-bold text-gray-500 uppercase">Amount in Words:</p>
                <p class="text-xs font-bold text-purple-900 mt-1 italic">Rupees One Lakh Eighty Two Thousand Nine Hundred Only</p>
              </div>
              <div class="mt-4 text-xs text-gray-600">
                <p><strong>Bank:</strong> State Bank of India | <strong>A/C:</strong> 389201948102</p>
                <p><strong>IFSC:</strong> SBIN0004044 | <strong>UPI VPA:</strong> billing@sbi</p>
              </div>
            </div>
            <div class="space-y-2 text-sm text-right">
              <div class="flex justify-between text-gray-600"><span>Taxable Subtotal:</span><span>₹1,55,000.00</span></div>
              <div class="flex justify-between text-gray-600"><span>CGST (9%):</span><span>₹13,950.00</span></div>
              <div class="flex justify-between text-gray-600"><span>SGST (9%):</span><span>₹13,950.00</span></div>
              <div class="flex justify-between text-lg font-black text-purple-900 pt-2 border-t-2 border-purple-900">
                <span>Total Invoice Value:</span><span>₹1,82,900.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PdfPreviewComponent {
  print() {
    window.print();
  }
}