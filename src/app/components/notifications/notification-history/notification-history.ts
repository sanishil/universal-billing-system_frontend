import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification as AppNotification, NotificationType } from '../../../models/notification';

const TYPE_META: Record<NotificationType, { icon: string; label: string }> = {
  EMAIL:         { icon: '✉', label: 'EMAIL' },
  SMS:           { icon: '💬', label: 'SMS' },
  BILL_RECEIVED: { icon: '📥', label: 'BILL RECEIVED' },
  BILL_EMAILED:  { icon: '📤', label: 'BILL EMAILED' },
  BILL_VIEWED:   { icon: '👁', label: 'BILL VIEWED' }
};

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  getTypeIcon(type: NotificationType): string {
    return TYPE_META[type]?.icon ?? '🔔';
  }

  getTypeLabel(type: NotificationType): string {
    return TYPE_META[type]?.label ?? type;
  }

  isBillEvent(type: NotificationType): boolean {
    return type.startsWith('BILL_');
  }

  /** Received bills open the Received tab; emailed/viewed bills open the issuer's copy */
  billLink(n: AppNotification): string[] {
    if (n.type === 'BILL_RECEIVED' || !n.billId) return ['/bills'];
    return ['/bills/view', n.billId];
  }

  billLinkParams(n: AppNotification): Record<string, string> | null {
    if (n.type === 'BILL_RECEIVED') return { scope: 'received' };
    return n.billId ? null : { scope: 'sent' };
  }
}
