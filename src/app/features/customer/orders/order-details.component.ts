import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IOrder } from '../../../core/models/i-order.model';
import { CustomerOrderService } from '../../../core/services/customer-order.service';
import { CustomerLayoutComponent } from '../../../shared/components/customer-layout/customer-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink, CustomerLayoutComponent, TranslatePipe],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  order: IOrder | null = null;
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly customerOrderService: CustomerOrderService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.customerOrderService.getOrder(orderId).subscribe({
      next: order => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  paymentStatusBadgeClass(status: string): string {
    if (status === 'paid') return 'badge badge-success';
    if (status === 'partial') return 'badge badge-warning';
    return 'badge badge-danger';
  }

  paymentStatusKey(status: string): string {
    if (status === 'paid') return 'order_status_paid';
    if (status === 'partial') return 'order_status_partial';
    return 'order_status_unpaid';
  }

  installmentStatusBadgeClass(status: string): string {
    return status === 'paid' ? 'badge badge-success' : 'badge badge-danger';
  }
}
