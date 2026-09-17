import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, Event, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class AppComponent implements OnInit {
  hideLayout = true;
  layoutService = inject(LayoutService);
  private router = inject(Router);

  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  ngOnInit() {
    this.evaluateLayout(this.router.url);

    this.layoutService.isSidebarCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.layoutService.isMobileSidebarOpen$.subscribe((open) => {
      this.isMobileSidebarOpen = open;
    });

    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.evaluateLayout(event.url);
        this.layoutService.closeMobileSidebar();
      });
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