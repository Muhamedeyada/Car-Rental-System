import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser } from '../models/i-user.model';
import { IPagination } from '../models/i-pagination.model';
import { IMessageResponse } from '../models/i-message-response.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  listUsers(page: number, search = '', role = '', perPage = 15): Observable<IPagination<IUser>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    if (search) params = params.set('search', search);
    if (role) params = params.set('role', role);
    return this.httpClient.get<IPagination<IUser>>(`${this.apiBaseUrl}/admin/users`, { params });
  }

  getUser(id: number): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.apiBaseUrl}/admin/users/${id}`);
  }

  createUser(body: Record<string, unknown>): Observable<IUser> {
    return this.httpClient.post<IUser>(`${this.apiBaseUrl}/admin/users`, body);
  }

  updateUser(id: number, body: Record<string, unknown>): Observable<IUser> {
    return this.httpClient.put<IUser>(`${this.apiBaseUrl}/admin/users/${id}`, body);
  }

  deleteUser(id: number): Observable<IMessageResponse> {
    return this.httpClient.delete<IMessageResponse>(`${this.apiBaseUrl}/admin/users/${id}`);
  }
}
