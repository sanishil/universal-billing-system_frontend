import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { BillService } from '../../../services/bill.service';
import { ProfilePayload, SettingsService, SystemSettingsPayload } from '../../../services/settings.service';
import { ToastService } from '../../../services/toast.service';
import { Business, BusinessPayload } from '../../../models/business';
import { INDIAN_STATES } from '../../../shared/utils/indian-states';

const emptyBusinessForm = (): BusinessPayload => ({ name: '', gstin: '', address: '', stateCode: '' });

type NotificationKey = 'emailOnPayment' | 'emailOnOverdue' | 'weeklyReport' | 'emailOnNewClient';

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
  private billService = inject(BillService);
  private toast = inject(ToastService);
  // The app runs without zone.js, so HTTP responses don't re-render on their own
  private cdr = inject(ChangeDetectorRef);

  readonly states = INDIAN_STATES;

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  role = this.authService.getCurrentUser()?.role || 'Administrator';
  accountActive = true;

  isSaving = false;

  /** null until /bills/stats answers */
  billCount: number | null = null;
  paidPercent: number | null = null;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = false;

  /** Shared with System Settings; null until loaded */
  systemSettings: SystemSettingsPayload | null = null;
  readonly notificationOptions: { key: NotificationKey; label: string }[] = [
    { key: 'emailOnPayment',   label: 'Payment Alerts' },
    { key: 'emailOnOverdue',   label: 'Overdue Reminders' },
    { key: 'weeklyReport',     label: 'Weekly Reports' },
    { key: 'emailOnNewClient', label: 'New Client Signup' }
  ];

  /** The user's businesses; customers are created under one of these */
  businesses: Business[] = [];
  businessesLoaded = false;
  /** Business being edited: its id, 'new' for the add form, null when the form is closed */
  editingBusinessId: string | null = null;
  businessForm: BusinessPayload = emptyBusinessForm();
  isSavingBusiness = false;

  get name(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const f = this.firstName.charAt(0) || '';
    const l = this.lastName.charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  }

  /** Default business — its GSTIN and state go on bills */
  get defaultBusiness(): Business | undefined {
    return this.businesses[0];
  }

  get passwordStrength(): { percent: number; label: string; color: string } {
    const p = this.newPassword;
    if (!p) return { percent: 0, label: '', color: 'transparent' };
    const score = [p.length >= 8, p.length >= 12, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)]
      .filter(Boolean).length;
    if (p.length < 8 || score <= 2) return { percent: 33, label: 'Weak', color: 'var(--ubs-danger-text)' };
    if (score === 3) return { percent: 66, label: 'Moderate', color: 'var(--ubs-warning-text)' };
    return { percent: 100, label: 'Strong', color: 'var(--ubs-success-text)' };
  }

  get passwordsMismatch(): boolean {
    return !!this.confirmPassword && this.confirmPassword !== this.newPassword;
  }

  ngOnInit() {
    this.loadProfile();
    this.loadBusinesses();
    this.loadStats();
    this.settingsService.getSystemSettings()
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: settings => this.systemSettings = settings,
        error: () => this.systemSettings = null
      });
  }

  loadStats() {
    this.billService.getStats('sent')
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: stats => {
          this.billCount = stats.totalCount;
          this.paidPercent = stats.totalCount ? Math.round((stats.paidCount / stats.totalCount) * 100) : null;
        },
        error: () => {
          this.billCount = null;
          this.paidPercent = null;
        }
      });
  }

  loadProfile() {
    this.settingsService.getProfile()
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: profile => {
          this.firstName = profile.firstName;
          this.lastName = profile.lastName;
          this.email = profile.email;
          this.phone = profile.phone;
          if (profile.role) this.role = profile.role;
          this.accountActive = !profile.status || profile.status === 'ACTIVE';
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

  focusPersonalInfo() {
    const input = document.getElementById('prf-first-name') as HTMLInputElement | null;
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus({ preventScroll: true });
  }

  updateProfile() {
    const payload: ProfilePayload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    };

    this.isSaving = true;
    this.settingsService.updateProfile(payload)
      .pipe(finalize(() => { this.isSaving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.authService.updateCurrentUser({ name: this.name, email: this.email });
          this.toast.success('Profile saved.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Profile could not be saved. Please try again.')
      });
  }

  resetForm() {
    this.loadProfile();
  }

  changePassword() {
    if (!this.currentPassword) {
      this.toast.error('Please enter your current password.');
      return;
    }
    if (this.newPassword.length < 8) {
      this.toast.error('New password must be at least 8 characters.');
      return;
    }
    if (this.passwordsMismatch || !this.confirmPassword) {
      this.toast.error('New password and confirmation do not match.');
      return;
    }

    this.isChangingPassword = true;
    this.settingsService.changePassword(this.currentPassword, this.newPassword)
      .pipe(finalize(() => { this.isChangingPassword = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.toast.success('Password updated.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Password could not be updated. Please try again.')
      });
  }

  toggleNotification(key: NotificationKey) {
    const settings = this.systemSettings;
    if (!settings) return;
    const previous = settings[key];
    settings[key] = !previous;
    this.settingsService.updateSystemSettings(settings).subscribe({
      error: () => {
        settings[key] = previous;
        this.cdr.markForCheck();
        this.toast.error('Preference could not be saved. Please try again.');
      }
    });
  }

  // ── Businesses ─────────────────────────────────────────────────────────────

  loadBusinesses() {
    this.settingsService.getBusinesses()
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: list => {
          this.businesses = list;
          this.businessesLoaded = true;
          this.syncSessionBusiness();
          // Customers and bills need a business, so open the add form straight away
          if (!list.length) this.startAddBusiness();
        },
        error: () => {
          this.businessesLoaded = true;
          this.toast.error('Your businesses could not be loaded.');
        }
      });
  }

  stateName(code: string): string {
    return this.states.find(s => s.code === code)?.name ?? code;
  }

  startAddBusiness() {
    this.editingBusinessId = 'new';
    this.businessForm = emptyBusinessForm();
  }

  startEditBusiness(business: Business) {
    this.editingBusinessId = business.id;
    this.businessForm = {
      name: business.name,
      gstin: business.gstin || '',
      address: business.address || '',
      stateCode: business.stateCode || ''
    };
  }

  cancelBusinessEdit() {
    this.editingBusinessId = null;
  }

  saveBusiness() {
    if (!this.businessForm.name.trim()) {
      this.toast.error('Please enter the business name.');
      return;
    }
    if (!this.businessForm.stateCode) {
      this.toast.error('Please select the business state.');
      return;
    }

    const payload: BusinessPayload = {
      name: this.businessForm.name.trim(),
      gstin: (this.businessForm.gstin || '').trim().toUpperCase(),
      address: (this.businessForm.address || '').trim(),
      stateCode: this.businessForm.stateCode
    };
    const editingId = this.editingBusinessId;
    const request = editingId && editingId !== 'new'
      ? this.settingsService.updateBusiness(editingId, payload)
      : this.settingsService.createBusiness(payload);

    this.isSavingBusiness = true;
    request
      .pipe(finalize(() => { this.isSavingBusiness = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: saved => {
          const index = this.businesses.findIndex(b => b.id === saved.id);
          if (index >= 0) {
            this.businesses[index] = saved;
          } else {
            this.businesses.push(saved);
          }
          this.editingBusinessId = null;
          this.syncSessionBusiness();
          this.toast.success(index >= 0 ? 'Business updated.' : 'Business added.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Business could not be saved. Please try again.')
      });
  }

  deleteBusiness(business: Business) {
    if (!confirm(`Remove "${business.name}"? Customers already created under it keep the name.`)) return;

    this.settingsService.deleteBusiness(business.id)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          this.businesses = this.businesses.filter(b => b.id !== business.id);
          if (this.editingBusinessId === business.id) this.editingBusinessId = null;
          this.syncSessionBusiness();
          this.toast.success('Business removed.');
        },
        error: (err) => this.toast.error(err.error?.message || 'Business could not be removed. Please try again.')
      });
  }

  /** Bill create reads the supplier state from the session user, so mirror the default business there */
  private syncSessionBusiness() {
    const primary = this.businesses[0];
    this.authService.updateCurrentUser({
      businessName: primary?.name ?? '',
      gstin: primary?.gstin || null,
      address: primary?.address ?? '',
      stateCode: primary?.stateCode ?? null
    });
  }
}
