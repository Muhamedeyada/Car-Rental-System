import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, debounceTime } from 'rxjs';
import { ICar, ICarRequest } from '../../../core/models/i-car.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { AdminCarService } from '../../../core/services/admin-car.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../shared/utils/form-error-mapper';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [ReactiveFormsModule, AdminLayoutComponent, ConfirmDialogComponent, TranslatePipe],
  templateUrl: './admin-cars.component.html',
})
export class AdminCarsComponent implements OnInit, OnDestroy {
  carList: IPagination<ICar> | null = null;
  isLoading = false;
  currentPage = 1;
  searchControl = new FormControl('');
  brandFilter = new FormControl('');
  modalMode: 'none' | 'create' | 'edit' = 'none';
  selectedCar: ICar | null = null;
  isFormSubmitting = false;
  showDeleteConfirm = false;
  carToDelete: ICar | null = null;
  carForm: FormGroup;
  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminCarService: AdminCarService,
    private readonly toastService: ToastService
  ) {
    this.carForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      kilometers: [0, [Validators.required, Validators.min(0)]],
      price_per_day: [0, [Validators.required, Validators.min(0)]],
      image_url: [''],
    });
  }

  ngOnInit(): void {
    this.fetchCars();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
        this.currentPage = 1;
        this.fetchCars();
      })
    );
    this.subscriptions.add(
      this.brandFilter.valueChanges.pipe(debounceTime(400)).subscribe(() => {
        this.currentPage = 1;
        this.fetchCars();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchCars(): void {
    this.isLoading = true;
    this.adminCarService
      .listCars(this.currentPage, this.searchControl.value ?? '', this.brandFilter.value ?? '')
      .subscribe({
        next: result => {
          this.carList = result;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  openCreateModal(): void {
    this.carForm.reset({ transmission: 'automatic', fuel_type: 'petrol', available: true });
    this.selectedCar = null;
    this.modalMode = 'create';
  }

  openEditModal(car: ICar): void {
    this.carForm.patchValue({
      name: car.name,
      brand: car.brand,
      model: car.model,
      kilometers: car.kilometers,
      price_per_day: car.price_per_day,
      image_url: car.image_url ?? '',
    });
    this.selectedCar = car;
    this.modalMode = 'edit';
  }

  closeModal(): void {
    this.modalMode = 'none';
    this.selectedCar = null;
  }

  submitCarForm(): void {
    if (this.carForm.invalid || this.isFormSubmitting) return;
    this.isFormSubmitting = true;
    const formValue = this.carForm.value;
    const payload: ICarRequest = {
      name: formValue.name,
      brand: formValue.brand,
      model: formValue.model,
      kilometers: +formValue.kilometers,
      price_per_day: +formValue.price_per_day,
      image_url: formValue.image_url || undefined,
    };

    const request$ =
      this.modalMode === 'create'
        ? this.adminCarService.createCar(payload)
        : this.adminCarService.updateCar(this.selectedCar!.id, payload);

    request$.subscribe({
      next: () => {
        this.isFormSubmitting = false;
        this.toastService.showSuccess(
          this.modalMode === 'create' ? 'car_created_success' : 'car_updated_success'
        );
        this.closeModal();
        this.fetchCars();
      },
      error: (error: HttpErrorResponse) => {
        this.isFormSubmitting = false;
        mapApiValidationErrorsToForm(this.carForm, error);
      },
    });
  }

  openDeleteConfirm(car: ICar): void {
    this.carToDelete = car;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.carToDelete = null;
  }

  confirmDelete(): void {
    if (!this.carToDelete) return;
    this.adminCarService.deleteCar(this.carToDelete.id).subscribe({
      next: () => {
        this.toastService.showSuccess('car_deleted_success');
        this.showDeleteConfirm = false;
        this.carToDelete = null;
        this.fetchCars();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.carToDelete = null;
      },
    });
  }

  changePage(page: number): void {
    if (page < 1 || (this.carList && page > this.carList.last_page)) return;
    this.currentPage = page;
    this.fetchCars();
  }

  getPageNumbers(): number[] {
    if (!this.carList) return [];
    const total = this.carList.last_page;
    const current = this.carList.current_page;
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  get nameControl() { return this.carForm.get('name'); }
  get brandControl() { return this.carForm.get('brand'); }
  get modelControl() { return this.carForm.get('model'); }
  get kilometersControl() { return this.carForm.get('kilometers'); }
  get priceControl() { return this.carForm.get('price_per_day'); }
}
