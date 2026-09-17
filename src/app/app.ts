import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

// ⚠️ IMPORTANT: Adjust these import paths to match your actual project structure!
import { HeaderComponent } from './components/layout/header/header';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { FooterComponent } from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true, // Ensure this is true
  imports: [
    RouterOutlet, // Fixes: 'router-outlet' is not a known element
    NgIf,         // Fixes: *ngIf directive errors
    HeaderComponent,
    SidebarComponent,
    FooterComponent // Fixes: 'app-footer' is not a known element
  ],
  templateUrl: './app.html', // or './app.component.html'
  styleUrls: ['./app.css'] // or .scss
})
export class AppComponent implements OnInit {
  // 1. Default to TRUE. Prevents sidebar/header from painting on initial refresh.
  hideLayout = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // 2. Evaluate synchronously on initial page load
    this.evaluateLayout(this.router.url);

    // 3. Re-evaluate on every subsequent navigation (e.g., when user clicks "Logout")
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.evaluateLayout(event.url);
      });
  }

  private evaluateLayout(url: string) {
    const isAuthRoute = url.includes('/login') || url.includes('/register');
    const isPublicRoute = url.includes('/bill/view/');

    // 4. Use the EXACT SAME synchronous check as your authGuard
    const isAuthenticated = localStorage.getItem('auth_token') !== null;

    // Show fullscreen layout if it's an auth/public route OR the user is not logged in
    if (isAuthRoute || isPublicRoute || !isAuthenticated) {
      this.hideLayout = true;
    } else {
      this.hideLayout = false;
    }
  }
}