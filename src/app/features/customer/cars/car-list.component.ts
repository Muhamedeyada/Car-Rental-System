import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { ICar } from '../../../core/models/i-car.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { CustomerCarService } from '../../../core/services/customer-car.service';
import { CustomerLayoutComponent } from '../../../shared/components/customer-layout/customer-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomerLayoutComponent, TranslatePipe],
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit, OnDestroy {
  carList: IPagination<ICar> | null = null;
  isLoading = false;
  currentPage = 1;
  searchControl = new FormControl('');
  brandFilter = new FormControl('');
  minPriceFilter = new FormControl('');
  maxPriceFilter = new FormControl('');
  private subscriptions = new Subscription();

  constructor(private readonly customerCarService: CustomerCarService) {}

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
    this.subscriptions.add(
      this.minPriceFilter.valueChanges.pipe(debounceTime(600)).subscribe(() => {
        this.currentPage = 1;
        this.fetchCars();
      })
    );
    this.subscriptions.add(
      this.maxPriceFilter.valueChanges.pipe(debounceTime(600)).subscribe(() => {
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
    this.customerCarService
      .listCars(
        this.currentPage,
        this.searchControl.value ?? '',
        this.brandFilter.value ?? '',
        this.minPriceFilter.value ?? '',
        this.maxPriceFilter.value ?? ''
      )
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

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchCars();
  }
}
