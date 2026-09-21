import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettingsComponent {
  firstName = 'John';
  lastName = 'Doe';
  email = 'john.doe@example.com';
  phone = '+91 98765 43210';
  company = 'Doe Enterprises Pvt. Ltd.';
  gstin = '27AABCU9603R1ZX';

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  updateProfile() {
    console.log('Profile updated:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.company,
      gstin: this.gstin
    });
  }

  resetForm() {
    this.firstName = 'John';
    this.lastName = 'Doe';
    this.email = 'john.doe@example.com';
    this.phone = '+91 98765 43210';
    this.company = 'Doe Enterprises Pvt. Ltd.';
    this.gstin = '27AABCU9603R1ZX';
  }
}