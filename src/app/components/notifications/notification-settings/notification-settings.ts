import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-settings.html',
  styleUrl: './notification-settings.css'
})
export class NotificationSettingsComponent {
  emailEnabled = true;
  smsEnabled = false;
  reminderDays = 3;
  overdueAlerts = true;

  save() {
    // future: call notification settings API
    alert('Notification settings saved!');
  }
}