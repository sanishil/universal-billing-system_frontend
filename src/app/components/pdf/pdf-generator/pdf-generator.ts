import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">Generate & Send PDF</h1>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Bill</label>
          <select class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white">
            <option>Invoice #INV-001 - John Doe</option>
            <option>Invoice #INV-002 - Jane Smith</option>
          </select>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" [(ngModel)]="emailPdf" class="w-5 h-5 text-black">
            <span class="text-black dark:text-white">Email PDF to Customer</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" [(ngModel)]="smsPdf" class="w-5 h-5 text-black">
            <span class="text-black dark:text-white">Send SMS with Link</span>
          </label>
        </div>
        <button class="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">Generate & Send</button>
      </div>
    </div>
  `
})
export class PdfGeneratorComponent {
  emailPdf = true; smsPdf = false;
}