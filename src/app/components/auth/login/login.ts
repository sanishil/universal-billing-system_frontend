import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'alex.vance@universalbilling.io';
  password = '••••••••••••';
  isLoading = false;

  onLogin() {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.login(this.email, this.password);
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 400);
  }
}