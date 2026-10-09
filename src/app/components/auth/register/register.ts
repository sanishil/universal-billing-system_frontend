import { Component, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RecaptchaModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  siteKey = environment.recaptchaSiteKey;

  registerForm: FormGroup = this.fb.group({
    name:         ['', Validators.required],
    // company:      [''],
    email:        ['', [Validators.required, Validators.email]],
    phone:     ['', Validators.required],
    captchaToken: [null, Validators.required]
  });

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  isLoading = false;

  // Toast flash notification
  toastMessage = '';
  toastVisible = false;
  toastExiting = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private toastExitTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.toastExitTimer) clearTimeout(this.toastExitTimer);
  }

  get name()         { return this.registerForm.get('name')!; }
  // get company()      { return this.registerForm.get('company')!; }
  get email()        { return this.registerForm.get('email')!; }
  // get password()     { return this.registerForm.get('password')!; }
  get phone()     { return this.registerForm.get('phone')!; }
  get captchaToken() { return this.registerForm.get('captchaToken')!; }

  /** Show a toast that slides in, stays for 4 s, then fades out */
  showToast(message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.toastExitTimer) clearTimeout(this.toastExitTimer);

    this.toastMessage = message;
    this.toastExiting = false;
    this.toastVisible = true;

    this.toastTimer = setTimeout(() => {
      this.toastExiting = true;
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

  onCaptchaResolved(token: string | null): void {
    this.registerForm.patchValue({ captchaToken: token });
  }

  resetCaptcha(): void {
    this.captchaRef?.reset();
    this.registerForm.patchValue({ captchaToken: null });
  }

  onRegister() {
    if (this.isLoading) return;

    if (!this.name.value?.trim()) {
      this.showToast('Please enter your full name.');
      return;
    }
    if (!this.email.value?.trim()) {
      this.showToast('Please enter your work email.');
      return;
    }
    if (!this.phone.value?.trim()) {
      this.showToast('Please enter your phone number.');
      return;
    }
    if (!this.captchaToken.value) {
      this.showToast('Please complete the reCAPTCHA verification.');
      return;
    }

    this.isLoading = true;

    this.authService.register({
      name:         this.name.value.trim(),
      // company:      this.company.value?.trim() || '',
      email:        this.email.value.trim(),
      phone:        this.phone.value.trim(),
      captchaToken: this.captchaToken.value
    })
    .pipe(finalize(() => { this.isLoading = false; }))
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.captchaRef?.reset();
        this.registerForm.patchValue({ captchaToken: null });

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
}
