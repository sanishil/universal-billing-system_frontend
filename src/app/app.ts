import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd, Event, RouterOutlet } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgIf, NgClass } from '@angular/common';

import { HeaderComponent } from './components/layout/header/header';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { FooterComponent } from './components/layout/footer/footer';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgClass,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  hideLayout = true;
  layoutService = inject(LayoutService);
  private router = inject(Router);

  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  /** Emits once on destroy to automatically complete all subscriptions. */
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.evaluateLayout(this.router.url);

    this.layoutService.isSidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collapsed) => {
        this.isSidebarCollapsed = collapsed;
      });

    this.layoutService.isMobileSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((open) => {
        this.isMobileSidebarOpen = open;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.evaluateLayout(event.url);
        this.layoutService.closeMobileSidebar();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeMobileSidebar() {
    this.layoutService.closeMobileSidebar();
  }

  private evaluateLayout(url: string) {
    const isAuthRoute = url.includes('/login') || url.includes('/register');
    const isPublicRoute = url.includes('/bill/view/');

    const isAuthenticated =
      typeof window !== 'undefined' &&
      (localStorage.getItem('auth_token') !== null ||
        localStorage.getItem('ubs_auth_token') !== null);

    if (isAuthRoute || isPublicRoute || !isAuthenticated) {
      this.hideLayout = true;
    } else {
      this.hideLayout = false;
    }
  }
}