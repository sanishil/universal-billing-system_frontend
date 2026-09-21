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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, _pass: string): Observable<boolean> {
    const user: User = {
      id: 'USR-01',
      name: email.includes('@') ? email.split('@')[0] : email || 'Administrator',
      email: email.includes('@') ? email : `${email}@universalbilling.io`,
      role: 'Administrator'
    };

    this.currentUserSubject.next(user);
    return of(true);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
