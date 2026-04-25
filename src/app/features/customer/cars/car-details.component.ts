import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ICar } from '../../../core/models/i-car.model';
import { IOrderRequest } from '../../../core/models/i-order.model';
import { CustomerCarService } from '../../../core/services/customer-car.service';
import { CustomerOrderService } from '../../../core/services/customer-order.service';
import { CustomerLayoutComponent } from '../../../shared/components/customer-layout/customer-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../shared/utils/form-error-mapper';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomerLayoutComponent, TranslatePipe],
  templateUrl: './car-details.component.html',
})
export class CarDetailsComponent implements OnInit {
  car: ICar | null = null;
  isLoading = false;
  loadError = false;
  orderForm: FormGroup;
  isSubmitting = false;
  submitErrorKey: string | null = null;
  todayDate = new Date().toISOString().split('T')[0];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly customerCarService: CustomerCarService,
    private readonly customerOrderService: CustomerOrderService
  ) {
    this.orderForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      payment_type: ['cash', [Validators.required]],
      order_type: ['full', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.customerCarService.getCar(carId).subscribe({
      next: car => {
        this.car = car;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
      },
    });
  }

  submitOrder(): void {
    if (this.orderForm.invalid || this.isSubmitting || !this.car) return;
    this.isSubmitting = true;
    this.submitErrorKey = null;
    const payload: IOrderRequest = {
      car_id: this.car.id,
      start_date: this.orderForm.value.start_date,
      end_date: this.orderForm.value.end_date,
      payment_type: this.orderForm.value.payment_type,
      order_type: this.orderForm.value.order_type,
    };

    this.customerOrderService.createOrder(payload).subscribe({
      next: order => {
        this.isSubmitting = false;
        this.router.navigateByUrl(`/orders/${order.id}`);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (mapApiValidationErrorsToForm(this.orderForm, error)) return;
        this.submitErrorKey = 'error_server';
      },
    });
  }

  get startDateControl() { return this.orderForm.get('start_date'); }
  get endDateControl() { return this.orderForm.get('end_date'); }
}
