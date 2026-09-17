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

  onRegister() {
    this.isLoading = true;
    setTimeout(() => {
      this.authService.login(this.email, this.password);
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 400);
  }
}