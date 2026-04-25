import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICar } from '../models/i-car.model';
import { IPagination } from '../models/i-pagination.model';

@Injectable({ providedIn: 'root' })
export class CustomerCarService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listCars(page: number, search = '', brand = '', minPrice = '', maxPrice = '', perPage = 12): Observable<IPagination<ICar>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    if (search) params = params.set('search', search);
    if (brand) params = params.set('brand', brand);
    if (minPrice) params = params.set('min_price', minPrice);
    if (maxPrice) params = params.set('max_price', maxPrice);
    return this.httpClient.get<IPagination<ICar>>(`${this.apiBaseUrl}/customer/cars`, { params });
  }

  getCar(id: number): Observable<ICar> {
    return this.httpClient.get<ICar>(`${this.apiBaseUrl}/customer/cars/${id}`);
  }
}
