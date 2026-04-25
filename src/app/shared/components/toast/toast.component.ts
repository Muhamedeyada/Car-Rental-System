import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IToastMessage } from '../../../core/models/i-toast-message.model';
import { ToastService } from '../../../core/services/toast.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface IActiveToast extends IToastMessage {
  id: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  activeToasts: IActiveToast[] = [];
  private nextToastId = 0;
  private toastSubscription?: Subscription;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toast$.subscribe(toast => {
      const toastId = this.nextToastId++;
      this.activeToasts.push({ ...toast, id: toastId });
      setTimeout(() => this.dismissToast(toastId), 3500);
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription?.unsubscribe();
  }

  dismissToast(id: number): void {
    this.activeToasts = this.activeToasts.filter(t => t.id !== id);
  }
}
