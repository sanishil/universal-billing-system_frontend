import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  siteKey = environment.recaptchaSiteKey;

  loginForm: FormGroup = this.fb.group({
    username:     ['', Validators.required],
    password:     ['', Validators.required],
    captchaToken: [null, Validators.required]
  });

  showPassword = false;
  isLoading = false;

  // Toast flash notification
  toastMessage = '';
  toastVisible = false;
  toastExiting = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private toastExitTimer: ReturnType<typeof setTimeout> | null = null;

  // Modal
  activeModal: 'forgotPassword' | null = null;
  modalEmail = '';
  modalSuccessMsg = '';

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.toastExitTimer) clearTimeout(this.toastExitTimer);
  }

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }
  get captchaToken() { return this.loginForm.get('captchaToken')!; }

  /** Show a toast that slides in, stays for 4 s, then fades out */
  showToast(message: string): void {
    // Clear any existing timers so rapid errors don't overlap
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.toastExitTimer) clearTimeout(this.toastExitTimer);

    this.toastMessage = message;
    this.toastExiting = false;
    this.toastVisible = true;

    // Start exit animation after 4 s
    this.toastTimer = setTimeout(() => {
      this.toastExiting = true;
      // Remove from DOM after exit animation (300 ms)
      this.toastExitTimer = setTimeout(() => {
        this.toastVisible = false;
        this.toastExiting = false;
      }, 350);
    }, 4000);
  }

  dismissToast(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastExiting = true;
    this.toastExitTimer = setTimeout(() => {
      this.toastVisible = false;
      this.toastExiting = false;
    }, 350);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onCaptchaResolved(token: string | null): void {
    this.loginForm.patchValue({ captchaToken: token });
  }

  resetCaptcha(): void {
    this.captchaRef?.reset();
    this.loginForm.patchValue({ captchaToken: null });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      if (!this.username.value?.trim()) {
        this.showToast('Please enter your username or work email.');
        return;
      }
      if (!this.password.value?.trim()) {
        this.showToast('Please enter your password.');
        return;
      }
      if (!this.captchaToken.value) {
        this.showToast('Please complete the reCAPTCHA verification.');
        return;
      }
      return;
    }

    this.isLoading = true;

    this.authService.login(
      this.username.value.trim(),
      this.password.value,
      this.captchaToken.value
    )
    .pipe(finalize(() => { this.isLoading = false; }))
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.captchaRef?.reset();
        this.loginForm.patchValue({ captchaToken: null });

        // Read message directly from backend response
        // 400 / 409  → err.error.message
        // 422        → err.error.errors[0].message
        const msg =
          err.error?.message ||
          err.error?.errors?.[0]?.message ||
          'Something went wrong. Please try again.';
        this.showToast(msg);
      }
    });
  }

  // Modal
  openModal(type: 'forgotPassword'): void {
    this.activeModal = type;
    this.modalSuccessMsg = '';
    this.modalEmail = '';
  }

  closeModal(): void {
    this.activeModal = null;
    this.modalSuccessMsg = '';
  }

  submitModalAction(): void {
    if (this.activeModal === 'forgotPassword') {
      this.modalSuccessMsg = 'Password reset instructions dispatched successfully.';
    }
    setTimeout(() => this.closeModal(), 1800);
  }
}
