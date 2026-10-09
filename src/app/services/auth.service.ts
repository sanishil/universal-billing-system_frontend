import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

const SESSION_KEY = 'ubs_session_user';
const TOKEN_KEY = 'ubs_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
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

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string, captchaToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { username: email, password, captchaToken }).pipe(
      tap((res: LoginResponse) => {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  register(payload: { name: string; phone: string; email: string; captchaToken: string }): Observable<unknown> {
    return this.http.post(`${API_BASE_URL}/auth/register`, payload);
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
