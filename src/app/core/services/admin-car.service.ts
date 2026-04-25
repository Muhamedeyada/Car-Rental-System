import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICar, ICarRequest } from '../models/i-car.model';
import { IPagination } from '../models/i-pagination.model';
import { IMessageResponse } from '../models/i-message-response.model';

@Injectable({ providedIn: 'root' })
export class AdminCarService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listCars(page: number, search = '', brand = '', minPrice = '', maxPrice = '', perPage = 15): Observable<IPagination<ICar>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    if (search) params = params.set('search', search);
    if (brand) params = params.set('brand', brand);
    if (minPrice) params = params.set('min_price', minPrice);
    if (maxPrice) params = params.set('max_price', maxPrice);
    return this.httpClient.get<IPagination<ICar>>(`${this.apiBaseUrl}/admin/cars`, { params });
  }

  getCar(id: number): Observable<ICar> {
    return this.httpClient.get<ICar>(`${this.apiBaseUrl}/admin/cars/${id}`);
  }

  createCar(body: ICarRequest): Observable<ICar> {
    return this.httpClient.post<ICar>(`${this.apiBaseUrl}/admin/cars`, body);
  }

  updateCar(id: number, body: ICarRequest): Observable<ICar> {
    return this.httpClient.put<ICar>(`${this.apiBaseUrl}/admin/cars/${id}`, body);
  }

  deleteCar(id: number): Observable<IMessageResponse> {
    return this.httpClient.delete<IMessageResponse>(`${this.apiBaseUrl}/admin/cars/${id}`);
  }
}
