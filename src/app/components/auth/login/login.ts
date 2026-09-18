import { Component, OnInit, inject } from '@angular/core';
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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form Fields
  username = '';
  password = '';
  captchaInput = '';
  captchaCode = '';

  // UI States
  showPassword = false;

  isLoading = false;
  errorMessage = '';
  activeModal: 'activate' | 'forgotPassword' | 'lockUnlock' | null = null;
  modalEmail = '';
  modalUsername = '';
  modalSuccessMsg = '';
  activeInputField: 'username' | 'password' | 'captcha' = 'password';


  isCaps = false;

  ngOnInit(): void {
    this.generateCaptcha();
    // Auto-fill captcha for ease of login
    this.captchaInput = this.captchaCode;
  }

  /**
   * Generates a 5-character authentic alphanumeric security captcha
   */
  generateCaptcha(): void {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaCode = code;
    this.errorMessage = '';
  }

  /**
   * Reads the captcha code aloud for accessibility using SpeechSynthesis
   */
  playCaptchaAudio(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const spokenText = this.captchaCode.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(`Captcha code is: ${spokenText}`);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }



  /**
   * Virtual keyboard typing handler
   */
  onVirtualKeyPress(char: string): void {
    const charToAppend = this.isCaps ? char.toUpperCase() : char;
    if (this.activeInputField === 'username') {
      this.username += charToAppend;
    } else if (this.activeInputField === 'captcha') {
      this.captchaInput += charToAppend;
    } else {
      if (this.password === '••••••••••••') {
        this.password = '';
      }
      this.password += charToAppend;
    }
  }

  virtualBackspace(): void {
    if (this.activeInputField === 'username' && this.username.length > 0) {
      this.username = this.username.slice(0, -1);
    } else if (this.activeInputField === 'captcha' && this.captchaInput.length > 0) {
      this.captchaInput = this.captchaInput.slice(0, -1);
    } else if (this.password.length > 0) {
      if (this.password === '••••••••••••') {
        this.password = '';
      } else {
        this.password = this.password.slice(0, -1);
      }
    }
  }

  virtualClear(): void {
    if (this.activeInputField === 'username') {
      this.username = '';
    } else if (this.activeInputField === 'captcha') {
      this.captchaInput = '';
    } else {
      this.password = '';
    }
  }

  toggleCapsLock(): void {
    this.isCaps = !this.isCaps;
  }

  /**
   * Login Form Submission
   */
  onLogin(): void {
    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Please enter your username or work email.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    if (
      this.captchaInput.trim().toUpperCase() !== this.captchaCode.trim().toUpperCase()
    ) {
      this.errorMessage = 'Invalid Captcha code. Please enter the characters shown.';
      this.generateCaptcha();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      // Synchronize both token keys so guards & layout render correctly
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', 'mock-jwt-token-2026');
        localStorage.setItem('ubs_auth_token', 'mock-jwt-token-2026');
      }

      this.authService.login(this.username, this.password);
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 450);
  }


  // Modal actions
  openModal(type: 'activate' | 'forgotPassword' | 'lockUnlock'): void {
    this.activeModal = type;
    this.modalSuccessMsg = '';
    this.modalEmail = '';
    this.modalUsername = '';
  }

  closeModal(): void {
    this.activeModal = null;
    this.modalSuccessMsg = '';
  }

  submitModalAction(): void {
    if (this.activeModal === 'activate') {
      this.modalSuccessMsg = 'Account activation instructions sent to your registered address!';
    } else if (this.activeModal === 'forgotPassword') {
      this.modalSuccessMsg = 'Password reset instructions dispatched successfully.';
    } else if (this.activeModal === 'lockUnlock') {
      this.modalSuccessMsg = 'Account status verified. Access is currently active.';
    }
    setTimeout(() => {
      this.closeModal();
    }, 1800);
  }
}