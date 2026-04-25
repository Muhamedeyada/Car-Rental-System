import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IInstallment } from '../../../core/models/i-installment.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { CustomerInstallmentService } from '../../../core/services/customer-installment.service';
import { ToastService } from '../../../core/services/toast.service';
import { CustomerLayoutComponent } from '../../../shared/components/customer-layout/customer-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-installments',
  standalone: true,
  imports: [CustomerLayoutComponent, TranslatePipe, DatePipe],
  templateUrl: './installments.component.html',
})
export class InstallmentsComponent implements OnInit {
  installmentList: IPagination<IInstallment> | null = null;
  isLoading = false;
  currentPage = 1;
  payingInstallmentId: number | null = null;

  constructor(
    private readonly customerInstallmentService: CustomerInstallmentService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchInstallments();
  }

  fetchInstallments(): void {
    this.isLoading = true;
    this.customerInstallmentService.listInstallments(this.currentPage).subscribe({
      next: result => {
        this.installmentList = result;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  payInstallment(installment: IInstallment): void {
    if (this.payingInstallmentId !== null) return;
    this.payingInstallmentId = installment.id;
    this.customerInstallmentService.payInstallment(installment.id).subscribe({
      next: () => {
        this.payingInstallmentId = null;
        this.toastService.showSuccess('installment_paid_success');
        this.fetchInstallments();
      },
      error: () => {
        this.payingInstallmentId = null;
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchInstallments();
  }

  statusBadgeClass(status: string): string {
    if (status === 'paid') return 'badge badge-success';
    if (status === 'pending') return 'badge badge-warning';
    return 'badge badge-danger';
  }
}
