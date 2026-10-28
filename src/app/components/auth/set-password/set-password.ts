import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { InviteInfo } from '../../../models/invite';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}

/**
 * Landing page of the invite link in the "you've received a bill" email: /set-password?token=…
 * Setting a password signs the customer in and shows the bills sent to them.
 */
@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './set-password.html',
  styleUrls: ['../login/login.css', './set-password.css']
})
export class SetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  token = '';
  invite: InviteInfo | null = null;
  state: 'loading' | 'ready' | 'invalid' | 'expired' = 'loading';

  isSaving = false;
  showPassword = false;
  errorMessage = '';

  isResending = false;
  resendMessage = '';

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm:  ['', Validators.required]
  }, { validators: passwordsMatch });

  get password() { return this.form.get('password')!; }
  get confirm() { return this.form.get('confirm')!; }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.state = 'invalid';
      return;
    }

    this.authService.getInvite(this.token).subscribe({
      next: invite => {
        this.invite = invite;
        this.state = 'ready';
      },
      error: (err: HttpErrorResponse) => {
        this.state = err.status === 410 ? 'expired' : 'invalid';
      }
    });
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.password.hasError('required') || this.password.hasError('minlength')) {
        this.errorMessage = 'Your password must be at least 8 characters.';
      } else if (this.form.hasError('mismatch')) {
        this.errorMessage = 'The two passwords don\'t match.';
      }
      return;
    }

    this.isSaving = true;
    this.authService.setPassword(this.token, this.password.value)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => this.router.navigate(['/bills'], { queryParams: { scope: 'received' } }),
        error: (err: HttpErrorResponse) => {
          if (err.status === 410) {
            this.state = 'expired';
            return;
          }
          this.errorMessage =
            err.error?.message ||
            err.error?.errors?.[0]?.message ||
            'Something went wrong. Please try again.';
        }
      });
  }

  resendLink(): void {
    if (this.isResending) return;
    this.isResending = true;
    this.resendMessage = '';
    this.authService.resendInvite(this.token)
      .pipe(finalize(() => { this.isResending = false; }))
      .subscribe({
        next: () => this.resendMessage = 'A new link is on its way. Check your email.',
        error: () => this.resendMessage = 'We couldn\'t send a new link. Please ask the sender to email the bill again.'
      });
  }
}
