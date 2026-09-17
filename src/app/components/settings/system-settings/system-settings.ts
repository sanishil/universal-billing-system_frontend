import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">System Settings</h1>
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
            <select class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>INR (₹)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Tax Rate (%)</label>
            <input [(ngModel)]="taxRate" name="taxRate" type="number" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name (on Bills)</label>
          <input [(ngModel)]="companyName" name="companyName" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
        </div>
        <button type="submit" class="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">Save System Settings</button>
      </form>
    </div>
  `
})
export class SystemSettingsComponent {
  taxRate = 10; companyName = 'Universal Billing';
}