import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ubs-toast-portal" aria-live="assertive" aria-atomic="true">
      <div
        *ngFor="let toast of toastService.toasts$ | async; trackBy: trackById"
        class="ubs-toast"
        [class.ubs-toast--success]="toast.type === 'success'"
        role="alert"
      >
        <i [ngClass]="[
          'bi',
          'ubs-toast__icon',
          toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'
        ]"></i>
        <span class="ubs-toast__msg">{{ toast.message }}</span>
        <button
          type="button"
          class="ubs-toast__close"
          (click)="toastService.dismiss(toast.id)"
          aria-label="Dismiss"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ubs-toast-portal {
      position: fixed;
      top: 20px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    @keyframes ubs-toast-in {
      from { opacity: 0; transform: translateX(40px) scale(0.97); }
      to   { opacity: 1; transform: translateX(0)    scale(1);    }
    }

    .ubs-toast {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 300px;
      max-width: 460px;
      padding: 13px 14px 13px 16px;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 4px solid #f59e0b;
      border-radius: 12px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.18);
      animation: ubs-toast-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      pointer-events: all;
    }

    .ubs-toast.ubs-toast--success {
      border-left-color: #22c55e;
    }

    .ubs-toast__icon {
      font-size: 1.15rem;
      color: #f59e0b;
      flex-shrink: 0;
      line-height: 1;
    }

    .ubs-toast--success .ubs-toast__icon {
      color: #22c55e;
    }

    .ubs-toast__msg {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 600;
      color: #e2e8f0;
      line-height: 1.4;
    }

    .ubs-toast__close {
      background: none;
      border: none;
      color: rgba(226, 232, 240, 0.5);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
      line-height: 1;
    }

    .ubs-toast__close:hover {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }

    @media (max-width: 640px) {
      .ubs-toast-portal {
        right: 12px;
        top: 12px;
        left: 12px;
      }
      .ubs-toast {
        min-width: unset;
        max-width: 100%;
        width: 100%;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
  trackById = (_: number, t: ToastMessage) => t.id;
}
