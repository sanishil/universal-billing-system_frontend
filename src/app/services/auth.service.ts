import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'ubs_auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && localStorage.getItem(this.TOKEN_KEY)) {
      return {
        id: 'USR-01',
        name: 'Alex Vance',
        email: 'alex.vance@universalbilling.io',
        role: 'Administrator'
      };
    }
    // Default logged in user for convenience in static mode
    return {
      id: 'USR-01',
      name: 'Alex Vance',
      email: 'alex.vance@universalbilling.io',
      role: 'Administrator'
    };
  }

  login(email: string, _pass: string): Observable<boolean> {
    const user: User = {
      id: 'USR-01',
      name: email.split('@')[0] || 'Administrator',
      email: email || 'alex.vance@universalbilling.io',
      role: 'Administrator'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token-2026');
    }
    this.currentUserSubject.next(user);
    return of(true);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    // In static mode, default to authenticated so preview and pages work seamlessly
    return true;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
