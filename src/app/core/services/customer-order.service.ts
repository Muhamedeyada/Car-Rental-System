import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder, IOrderRequest } from '../models/i-order.model';
import { IPagination } from '../models/i-pagination.model';

@Injectable({ providedIn: 'root' })
export class CustomerOrderService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listOrders(page: number, perPage = 15): Observable<IPagination<IOrder>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);
    return this.httpClient.get<IPagination<IOrder>>(`${this.apiBaseUrl}/customer/orders`, { params });
  }

  createOrder(body: IOrderRequest): Observable<IOrder> {
    return this.httpClient.post<IOrder>(`${this.apiBaseUrl}/customer/orders`, body);
  }

  getOrder(id: number): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${this.apiBaseUrl}/customer/orders/${id}`);
  }
}
