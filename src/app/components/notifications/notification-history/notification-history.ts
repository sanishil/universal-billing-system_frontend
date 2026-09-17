import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-50 dark:bg-black min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">Notification History</h1>
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          <div *ngFor="let n of notifications" class="p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <div>
              <p class="font-bold text-black dark:text-white">{{ n.message }}</p>
              <p class="text-sm text-gray-500">Sent to: {{ n.recipient }} via {{ n.type }}</p>
            </div>
            <div class="text-right">
              <span [class]="n.status === 'SENT' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-bold text-sm">{{ n.status }}</span>
              <p class="text-xs text-gray-500 mt-1">{{ n.sentAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationHistoryComponent {
  notifications = [
    { message: 'Invoice #INV-001 Reminder', recipient: 'john@example.com', type: 'EMAIL', status: 'SENT', sentAt: '2026-09-17 10:00 AM' },
    { message: 'Invoice #INV-002 Reminder', recipient: '+1234567890', type: 'SMS', status: 'FAILED', sentAt: '2026-09-16 02:30 PM' }
  ];
}