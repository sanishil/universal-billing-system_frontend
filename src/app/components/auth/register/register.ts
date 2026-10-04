import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  company = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      name: this.name,
      company: this.company,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.password = '';
        this.successMessage = 'Account created. You can now sign in.';
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Check your details and try again.';
      }
    });
  }
}