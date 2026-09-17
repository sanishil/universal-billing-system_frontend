import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { publicBillGuard } from './guards/public-bill-guard';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated.guard';

export const routes: Routes = [
  // Authentication
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.LoginComponent),
    canActivate: [redirectIfAuthenticatedGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then(m => m.RegisterComponent),
    canActivate: [redirectIfAuthenticatedGuard]
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./components/layout/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  // Bills Management
  {
    path: 'bills',
    loadComponent: () => import('./components/bills/bill-list/bill-list').then(m => m.BillListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bills/create',
    loadComponent: () => import('./components/bills/bill-create/bill-create').then(m => m.BillCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bills/edit/:id',
    loadComponent: () => import('./components/bills/bill-edit/bill-edit').then(m => m.BillEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bills/view/:id',
    loadComponent: () => import('./components/bills/bill-view/bill-view').then(m => m.BillViewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bills/details/:id',
    loadComponent: () => import('./components/bills/bill-details/bill-details').then(m => m.BillDetailsComponent),
    canActivate: [authGuard]
  },

  // Customers Management
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customer-list/customer-list').then(m => m.CustomerListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers/create',
    loadComponent: () => import('./components/customers/customer-create/customer-create').then(m => m.CustomerCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers/:id',
    loadComponent: () => import('./components/customers/customer-details/customer-details').then(m => m.CustomerDetailsComponent),
    canActivate: [authGuard]
  },

  // Payments
  {
    path: 'payments',
    loadComponent: () => import('./components/payment/payment-history/payment-history').then(m => m.PaymentHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments/process',
    loadComponent: () => import('./components/payment/payment-process/payment-process').then(m => m.PaymentProcessComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments/success',
    loadComponent: () => import('./components/payment/payment-success/payment-success').then(m => m.PaymentSuccessComponent),
    canActivate: [authGuard]
  },

  // Reports & Analytics
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports-dashboard/reports-dashboard').then(m => m.ReportsDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/analytics',
    loadComponent: () => import('./components/reports/analytics/analytics').then(m => m.AnalyticsComponent),
    canActivate: [authGuard]
  },

  // PDF Engine
  {
    path: 'pdf/generator',
    loadComponent: () => import('./components/pdf/pdf-generator/pdf-generator').then(m => m.PdfGeneratorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pdf/preview',
    loadComponent: () => import('./components/pdf/pdf-preview/pdf-preview').then(m => m.PdfPreviewComponent),
    canActivate: [authGuard]
  },

  // Notifications
  {
    path: 'notifications',
    loadComponent: () => import('./components/notifications/notification-history/notification-history').then(m => m.NotificationHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notifications/settings',
    loadComponent: () => import('./components/notifications/notification-settings/notification-settings').then(m => m.NotificationSettingsComponent),
    canActivate: [authGuard]
  },

  // Settings
  {
    path: 'settings',
    redirectTo: 'settings/profile',
    pathMatch: 'full'
  },
  {
    path: 'settings/profile',
    loadComponent: () => import('./components/settings/profile-settings/profile-settings').then(m => m.ProfileSettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings/system',
    loadComponent: () => import('./components/settings/system-settings/system-settings').then(m => m.SystemSettingsComponent),
    canActivate: [authGuard]
  },

  // Public Bill View & Share Link
  {
    path: 'share/link',
    loadComponent: () => import('./components/share/share-link/share-link').then(m => m.ShareLinkComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bill/view/:uniqueId',
    loadComponent: () => import('./components/share/public-bill-view/public-bill-view').then(m => m.PublicBillViewComponent),
    canActivate: [publicBillGuard]
  },

  // Default redirect (Changed from /dashboard to /login)
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];