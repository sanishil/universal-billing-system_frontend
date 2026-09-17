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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem('auth_token');
      if (token) {
        return {
          id: 'USR-01',
          name: 'Alex Vance',
          email: 'alex.vance@universalbilling.io',
          role: 'Administrator'
        };
      }
    }
    return null;
  }

  login(email: string, _pass: string): Observable<boolean> {
    const user: User = {
      id: 'USR-01',
      name: email.includes('@') ? email.split('@')[0] : email || 'Administrator',
      email: email.includes('@') ? email : `${email}@universalbilling.io`,
      role: 'Administrator'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token-2026');
      localStorage.setItem('auth_token', 'mock-jwt-token-2026');
    }

    this.currentUserSubject.next(user);
    return of(true);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('ubs_auth_token');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem('auth_token'));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
