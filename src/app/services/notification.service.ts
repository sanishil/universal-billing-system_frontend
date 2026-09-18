import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Notification as AppNotification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private initialNotifications: AppNotification[] = [
    {
      id: 'NOTIF-001',
      type: 'EMAIL',
      recipient: 'billing@acmeglobal.tech',
      message: 'Invoice #INV-2026-001 has been marked PAID. Receipt dispatched.',
      status: 'SENT',
      sentAt: '2026-09-14 11:25 AM'
    },
    {
      id: 'NOTIF-002',
      type: 'EMAIL',
      recipient: 'accounts@starlightdesign.co',
      message: 'Friendly reminder: Invoice #INV-2026-002 is due in 7 days.',
      status: 'SENT',
      sentAt: '2026-09-15 09:00 AM'
    },
    {
      id: 'NOTIF-003',
      type: 'SMS',
      recipient: '+1 (555) 345-6789',
      message: 'URGENT: Invoice #INV-2026-003 is overdue. Please review immediately.',
      status: 'SENT',
      sentAt: '2026-09-12 02:15 PM'
    },
    {
      id: 'NOTIF-004',
      type: 'SMS',
      recipient: '+1 (555) 999-0000',
      message: 'SMS Gateway delivery timed out.',
      status: 'FAILED',
      sentAt: '2026-09-10 08:30 AM'
    }
  ];

  private notificationsSubject = new BehaviorSubject<AppNotification[]>(this.initialNotifications);
  public notifications$ = this.notificationsSubject.asObservable();

  getNotifications(): Observable<AppNotification[]> {
    return of(this.notificationsSubject.value);
  }

  sendNotification(notifData: Partial<AppNotification>): Observable<AppNotification> {
    const current = this.notificationsSubject.value;
    const newNotif: AppNotification = {
      id: `NOTIF-${String(current.length + 1).padStart(3, '0')}`,
      type: notifData.type || 'EMAIL',
      recipient: notifData.recipient || 'customer@example.com',
      message: notifData.message || 'Notification reminder from Universal Billing',
      status: 'SENT',
      sentAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };

    const updated = [newNotif, ...current];
    this.notificationsSubject.next(updated);
    return of(newNotif);
  }
}
