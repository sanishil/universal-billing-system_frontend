import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ProfilePayload, SettingsService } from '../../../services/settings.service';
import { ToastService } from '../../../services/toast.service';
import { INDIAN_STATES } from '../../../shared/utils/indian-states';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  readonly states = INDIAN_STATES;

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  businessName = '';
  gstin = '';
  address = '';
  /** Supplier state used for GST on every bill this user issues */
  stateCode = '';

  showPersonalInfo = false;
  isSaving = false;

  get name(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const f = this.firstName.charAt(0) || '';
    const l = this.lastName.charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  }

  ngOnInit() {
    this.settingsService.getProfile().subscribe({
      next: profile => {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.phone = profile.phone;
        this.businessName = profile.businessName || profile.company || '';
        this.gstin = profile.gstin || '';
        this.address = profile.address || '';
        this.stateCode = profile.stateCode || '';
        // Bills can't be issued without a state, so open the form straight away
        if (!this.stateCode) this.showPersonalInfo = true;
      },
      error: () => {
        // Fallback: pre-fill from auth session user if API isn't ready
        const user = this.authService.getCurrentUser();
        if (user) {
          const parts = (user.name || '').split(' ');
          this.firstName = parts[0] || '';
          this.lastName = parts.slice(1).join(' ') || '';
          this.email = user.email || '';
          this.businessName = user.businessName || '';
          this.gstin = user.gstin || '';
          this.address = user.address || '';
          this.stateCode = user.stateCode || '';
        }
        if (!this.stateCode) this.showPersonalInfo = true;
      }
    });
  }

  togglePersonalInfo() {
    this.showPersonalInfo = !this.showPersonalInfo;
  }

  updateProfile() {
    if (!this.stateCode) {
      this.toast.error('Please select your business state.');
      return;
    }

    const payload: ProfilePayload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.businessName,
      gstin: this.gstin.trim().toUpperCase(),
      businessName: this.businessName,
      address: this.address,
      stateCode: this.stateCode
    };

    this.isSaving = true;
    this.settingsService.updateProfile(payload)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          // Bill create reads the supplier state from the session user
          this.authService.updateCurrentUser({
            name: this.name,
            email: this.email,
            businessName: payload.businessName,
            gstin: payload.gstin || null,
            address: payload.address,
            stateCode: payload.stateCode
          });
          this.toast.success('Profile saved.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Profile could not be saved. Please try again.')
      });
  }

  resetForm() {
    this.ngOnInit();
  }
}
