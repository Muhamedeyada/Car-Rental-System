import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { IOrder } from '../../../core/models/i-order.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { AdminOrderService } from '../../../core/services/admin-order.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [ReactiveFormsModule, AdminLayoutComponent, ConfirmDialogComponent, TranslatePipe, DatePipe],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orderList: IPagination<IOrder> | null = null;
  isLoading = false;
  currentPage = 1;
  searchControl = new FormControl('');
  paymentTypeFilter = new FormControl('');
  paymentStatusFilter = new FormControl('');
  orderTypeFilter = new FormControl('');
  viewedOrder: IOrder | null = null;
  orderForStatusUpdate: IOrder | null = null;
  newPaymentStatus = new FormControl('');
  isUpdatingStatus = false;
  showDeleteConfirm = false;
  orderToDelete: IOrder | null = null;
  private subscriptions = new Subscription();

  constructor(
    private readonly adminOrderService: AdminOrderService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
        this.currentPage = 1;
        this.fetchOrders();
      })
    );
    const filterControls = [this.paymentTypeFilter, this.paymentStatusFilter, this.orderTypeFilter];
    filterControls.forEach(ctrl =>
      this.subscriptions.add(
        ctrl.valueChanges.subscribe(() => {
          this.currentPage = 1;
          this.fetchOrders();
        })
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.adminOrderService
      .listOrders(
        this.currentPage,
        this.searchControl.value ?? '',
        this.paymentTypeFilter.value ?? '',
        this.paymentStatusFilter.value ?? '',
        this.orderTypeFilter.value ?? ''
      )
      .subscribe({
        next: result => {
          this.orderList = result;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  openViewModal(order: IOrder): void {
    this.viewedOrder = order;
  }

  closeViewModal(): void {
    this.viewedOrder = null;
  }

  openStatusModal(order: IOrder): void {
    this.orderForStatusUpdate = order;
    this.newPaymentStatus.setValue(order.payment_status);
  }

  closeStatusModal(): void {
    this.orderForStatusUpdate = null;
  }

  submitStatusUpdate(): void {
    if (!this.orderForStatusUpdate || this.isUpdatingStatus) return;
    this.isUpdatingStatus = true;
    this.adminOrderService
      .updatePaymentStatus(this.orderForStatusUpdate.id, this.newPaymentStatus.value ?? '')
      .subscribe({
        next: () => {
          this.isUpdatingStatus = false;
          this.toastService.showSuccess('order_status_updated_success');
          this.closeStatusModal();
          this.fetchOrders();
        },
        error: () => {
          this.isUpdatingStatus = false;
        },
      });
  }

  openDeleteConfirm(order: IOrder): void {
    this.orderToDelete = order;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.orderToDelete = null;
  }

  confirmDelete(): void {
    if (!this.orderToDelete) return;
    this.adminOrderService.deleteOrder(this.orderToDelete.id).subscribe({
      next: () => {
        this.toastService.showSuccess('order_deleted_success');
        this.showDeleteConfirm = false;
        this.orderToDelete = null;
        this.fetchOrders();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.orderToDelete = null;
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchOrders();
  }

  paymentStatusBadgeClass(status: string): string {
    if (status === 'success') return 'badge badge-success';
    if (status === 'pending') return 'badge badge-warning';
    return 'badge badge-danger';
  }

  paymentStatusKey(status: string): string {
    if (status === 'success') return 'order_status_paid';
    if (status === 'pending') return 'order_status_unpaid';
    return 'error_server';
  }
}
