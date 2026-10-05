import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  siteKey = environment.recaptchaSiteKey;

  loginForm: FormGroup = this.fb.group({
    username:     ['', Validators.required],
    password:     ['', Validators.required],
    captchaToken: [null, Validators.required]
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Modal
  activeModal: 'forgotPassword' | null = null;
  modalEmail = '';
  modalSuccessMsg = '';

  ngOnInit(): void {}

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }
  get captchaToken() { return this.loginForm.get('captchaToken')!; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onCaptchaResolved(token: string | null): void {
    this.loginForm.patchValue({ captchaToken: token });
  }

  onLogin(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      if (!this.username.value?.trim()) {
        this.errorMessage = 'Please enter your username or work email.';
        return;
      }
      if (!this.password.value?.trim()) {
        this.errorMessage = 'Please enter your password.';
        return;
      }
      if (!this.captchaToken.value) {
        this.errorMessage = 'Please complete the reCAPTCHA verification.';
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
        // Reset captcha on error
        this.loginForm.patchValue({ captchaToken: null });
        const body = err?.error;
        this.errorMessage =
          (typeof body === 'string' && body.trim()) ||
          body?.message ||
          body?.error ||
          body?.detail ||
          err?.message ||
          'Login failed. Please try again.';
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
