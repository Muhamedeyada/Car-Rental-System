import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IOrder } from '../../../core/models/i-order.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { CustomerOrderService } from '../../../core/services/customer-order.service';
import { CustomerLayoutComponent } from '../../../shared/components/customer-layout/customer-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CustomerLayoutComponent, TranslatePipe, DatePipe],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orderList: IPagination<IOrder> | null = null;
  isLoading = false;
  currentPage = 1;

  constructor(private readonly customerOrderService: CustomerOrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.customerOrderService.listOrders(this.currentPage).subscribe({
      next: result => {
        this.orderList = result;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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
    return 'order_status_partial';
  }
}
