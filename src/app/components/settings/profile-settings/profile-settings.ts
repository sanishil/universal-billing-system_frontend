import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { API_BASE_URL } from '../../../services/api.config';

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  gstin: string;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  company = '';
  gstin = '';

  showPersonalInfo = false;

  get name(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const f = this.firstName.charAt(0) || '';
    const l = this.lastName.charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  }

  ngOnInit() {
    this.http.get<ProfilePayload>(`${API_BASE_URL}/settings/profile`).subscribe({
      next: profile => {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.phone = profile.phone;
        this.company = profile.company;
        this.gstin = profile.gstin;
      },
      error: () => {
        // Fallback: pre-fill from auth session user if API isn't ready
        const user = this.authService.getCurrentUser();
        if (user) {
          const parts = (user.name || '').split(' ');
          this.firstName = parts[0] || '';
          this.lastName = parts.slice(1).join(' ') || '';
          this.email = user.email || '';
        }
      }
    });
  }

  togglePersonalInfo() {
    this.showPersonalInfo = !this.showPersonalInfo;
  }

  updateProfile() {
    const payload: ProfilePayload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.company,
      gstin: this.gstin
    };
    this.http.put<ProfilePayload>(`${API_BASE_URL}/settings/profile`, payload).subscribe();
  }

  resetForm() {
    this.ngOnInit();
  }
}
