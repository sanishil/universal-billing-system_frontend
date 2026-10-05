import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RecaptchaModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup = this.fb.group({
    name:         ['', Validators.required],
    company:      [''],
    email:        ['', [Validators.required, Validators.email]],
    password:     ['', Validators.required],
    captchaToken: [null, Validators.required]
  });

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  isLoading = false;
  errorMessage = '';

  get name()         { return this.registerForm.get('name')!; }
  get company()      { return this.registerForm.get('company')!; }
  get email()        { return this.registerForm.get('email')!; }
  get password()     { return this.registerForm.get('password')!; }
  get captchaToken() { return this.registerForm.get('captchaToken')!; }

  onCaptchaResolved(token: string | null): void {
    this.registerForm.patchValue({ captchaToken: token });
  }

  resetCaptcha(): void {
    this.captchaRef?.reset();
    this.registerForm.patchValue({ captchaToken: null });
  }

  onRegister() {
    // Prevent duplicate submissions
    if (this.isLoading) return;

    this.errorMessage = '';

    if (!this.name.value?.trim()) {
      this.errorMessage = 'Please enter your full name.';
      return;
    }
    if (!this.email.value?.trim()) {
      this.errorMessage = 'Please enter your work email.';
      return;
    }
    if (!this.password.value?.trim()) {
      this.errorMessage = 'Please enter a password.';
      return;
    }
    if (!this.captchaToken.value) {
      this.errorMessage = 'Please complete the reCAPTCHA verification.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      name:         this.name.value.trim(),
      company:      this.company.value?.trim() || '',
      email:        this.email.value.trim(),
      password:     this.password.value,
      captchaToken: this.captchaToken.value
    })
    .pipe(finalize(() => { this.isLoading = false; }))
    .subscribe({
      next: () => {
        this.registerForm.patchValue({ captchaToken: null });
        alert('Account created successfully! Click OK to sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.registerForm.patchValue({ captchaToken: null });
        const body = err?.error;
        this.errorMessage =
          (typeof body === 'string' && body.trim()) ||
          body?.message ||
          body?.error ||
          body?.detail ||
          'Registration failed. Please check your details and try again.';
      }
    });
  }
}
