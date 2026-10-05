import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification as AppNotification } from '../models/notification';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${API_BASE_URL}/notifications`);
  }

  sendNotification(notifData: Partial<AppNotification>): Observable<AppNotification> {
    return this.http.post<AppNotification>(`${API_BASE_URL}/notifications`, notifData);
  }
}
