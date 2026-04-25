import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder } from '../models/i-order.model';
import { IPagination } from '../models/i-pagination.model';
import { IMessageResponse } from '../models/i-message-response.model';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listOrders(
    page: number,
    search = '',
    paymentType = '',
    paymentStatus = '',
    orderType = '',
    perPage = 15
  ): Observable<IPagination<IOrder>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    if (search) params = params.set('search', search);
    if (paymentType) params = params.set('payment_type', paymentType);
    if (paymentStatus) params = params.set('payment_status', paymentStatus);
    if (orderType) params = params.set('order_type', orderType);
    return this.httpClient.get<IPagination<IOrder>>(`${this.apiBaseUrl}/admin/orders`, { params });
  }

  getOrder(id: number): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${this.apiBaseUrl}/admin/orders/${id}`);
  }

  updatePaymentStatus(id: number, paymentStatus: string): Observable<IOrder> {
    return this.httpClient.put<IOrder>(`${this.apiBaseUrl}/admin/orders/${id}`, { payment_status: paymentStatus });
  }

  deleteOrder(id: number): Observable<IMessageResponse> {
    return this.httpClient.delete<IMessageResponse>(`${this.apiBaseUrl}/admin/orders/${id}`);
  }
}
