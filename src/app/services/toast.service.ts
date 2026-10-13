import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this._toasts.asObservable();
  private nextId = 0;

  show(message: string, type: 'success' | 'error' = 'error', duration = 4000): void {
    const id = ++this.nextId;
    const current = this._toasts.value;
    this._toasts.next([...current, { message, type, id }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }
}
