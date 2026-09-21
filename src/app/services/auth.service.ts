import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const SESSION_KEY = 'ubs_session_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getSessionUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  /** Restore user from sessionStorage on page refresh */
  private getSessionUser(): User | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  login(email: string, _pass: string): Observable<boolean> {
    const user: User = {
      id: 'USR-01',
      name: email.includes('@') ? email.split('@')[0] : email || 'Administrator',
      email: email.includes('@') ? email : `${email}@universalbilling.io`,
      role: 'Administrator'
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    return of(true);
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
