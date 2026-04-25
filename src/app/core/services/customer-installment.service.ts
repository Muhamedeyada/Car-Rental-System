import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IInstallment } from '../models/i-installment.model';
import { IPagination } from '../models/i-pagination.model';

@Injectable({ providedIn: 'root' })
export class CustomerInstallmentService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listInstallments(page: number, perPage = 15): Observable<IPagination<IInstallment>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);
    return this.httpClient.get<IPagination<IInstallment>>(`${this.apiBaseUrl}/customer/installments`, { params });
  }

  payInstallment(id: number): Observable<IInstallment> {
    return this.httpClient.post<IInstallment>(`${this.apiBaseUrl}/customer/installments/${id}/pay`, {});
  }
}
