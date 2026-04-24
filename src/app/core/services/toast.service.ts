import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IToastMessage } from '../models/i-toast-message.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<IToastMessage>();

  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.toastSubject.next({ type: 'error', message });
  }

  showWarning(message: string): void {
    this.toastSubject.next({ type: 'warning', message });
  }
}
