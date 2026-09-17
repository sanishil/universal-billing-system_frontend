import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Desktop sidebar collapsed state (website toggler)
  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public isSidebarCollapsed$ = this.isSidebarCollapsedSubject.asObservable();

  // Mobile off-canvas drawer open state (mobile toggler)
  private isMobileSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  public isMobileSidebarOpen$ = this.isMobileSidebarOpenSubject.asObservable();

  get isSidebarCollapsed(): boolean {
    return this.isSidebarCollapsedSubject.value;
  }

  get isMobileSidebarOpen(): boolean {
    return this.isMobileSidebarOpenSubject.value;
  }

  /**
   * Unified toggle handler:
   * - On mobile/tablet (<= 1024px): toggles the off-canvas mobile drawer
   * - On desktop (> 1024px): toggles sidebar collapse/expand
   */
  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.toggleMobileSidebar();
    } else {
      this.toggleDesktopSidebar();
    }
  }

  toggleDesktopSidebar(): void {
    this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpenSubject.next(!this.isMobileSidebarOpenSubject.value);
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpenSubject.next(true);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpenSubject.next(false);
  }

  closeAll(): void {
    this.isMobileSidebarOpenSubject.next(false);
  }
}
