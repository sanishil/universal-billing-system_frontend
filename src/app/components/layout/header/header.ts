import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public layoutService = inject(LayoutService);

  currentUser = this.authService.getCurrentUser();
  notificationsCount = 3;

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
