import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL, SKIP_AUTH } from './api.config';
import { InviteInfo, SetPasswordRequest } from '../models/invite';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  businessName?: string;
  gstin?: string | null;
  /** Supplier state for GST; required before the user can issue bills */
  stateCode?: string | null;
  address?: string;
  status?: 'INVITED' | 'ACTIVE' | 'DISABLED';
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
      tap(res => this.startSession(res))
    );
  }

  register(payload: { name: string; phone: string; email: string; captchaToken: string }): Observable<unknown> {
    return this.http.post(`${API_BASE_URL}/auth/register`, payload);
  }

  /** Invite details for the set-password page. 410 when the link is expired or used. */
  getInvite(token: string): Observable<InviteInfo> {
    return this.http.get<InviteInfo>(`${API_BASE_URL}/auth/invite/${encodeURIComponent(token)}`, {
      context: new HttpContext().set(SKIP_AUTH, true)
    });
  }

  /** Completes an invite. Returns the same shape as login and starts a session. */
  setPassword(token: string, password: string): Observable<LoginResponse> {
    const body: SetPasswordRequest = { token, password };
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/set-password`, body, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(
      tap(res => this.startSession(res))
    );
  }

  /** Asks for a fresh invite email when the old link expired (410) */
  resendInvite(token: string): Observable<unknown> {
    return this.http.post(`${API_BASE_URL}/auth/invite/resend`, { token }, {
      context: new HttpContext().set(SKIP_AUTH, true)
    });
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  /** A user is signed in only while their JWT has not expired. */
  isAuthenticated(): boolean {
    if (this.currentUserSubject.value === null) return false;

    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Merge profile changes (business name, state…) into the stored session user */
  updateCurrentUser(changes: Partial<User>): void {
    const user = this.currentUserSubject.value;
    if (!user) return;
    const updated = { ...user, ...changes };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    this.currentUserSubject.next(updated);
  }

  private startSession(res: LoginResponse): void {
    sessionStorage.setItem(TOKEN_KEY, res.token);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  /** Reads the "exp" claim. Tokens without one, or that can't be decoded, are left to the backend to reject. */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      if (!payload) return false;
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const exp = (JSON.parse(json) as { exp?: number }).exp;
      return typeof exp === 'number' && exp * 1000 <= Date.now();
    } catch {
      return false;
    }
  }
}
