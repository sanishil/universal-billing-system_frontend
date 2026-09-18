import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { Notification as AppNotification } from '../../../models/notification';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-history.html',
  styleUrl: './notification-history.css'
})
export class NotificationHistoryComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: AppNotification[] = [];

  get sentCount(): number {
    return this.notifications.filter(n => n.status === 'SENT').length;
  }

  get failedCount(): number {
    return this.notifications.filter(n => n.status === 'FAILED').length;
  }

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifs => {
      this.notifications = notifs;
    });
  }

  getTypeIcon(type: string): string {
    return type === 'EMAIL' ? '✉' : '💬';
  }
}