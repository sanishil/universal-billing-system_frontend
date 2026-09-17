import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">Notification Settings</h1>
      <div class="space-y-6">
        <div class="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div>
            <h3 class="font-bold text-black dark:text-white">Email Notifications</h3>
            <p class="text-sm text-gray-500">Send bill reminders via email</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" [(ngModel)]="emailEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
          </label>
        </div>
        <div class="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div>
            <h3 class="font-bold text-black dark:text-white">SMS Notifications</h3>
            <p class="text-sm text-gray-500">Send bill reminders via SMS</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" [(ngModel)]="smsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
          </label>
        </div>
        <button class="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">Save Settings</button>
      </div>
    </div>
  `
})
export class NotificationSettingsComponent {
  emailEnabled = true; smsEnabled = false;
}