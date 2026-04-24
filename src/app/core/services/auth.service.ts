import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IUser } from '../models/i-user.model';
import { IAuthResponse } from '../models/i-auth-response.model';
import { ILoginRequest } from '../models/i-login-request.model';
import { IRegisterRequest } from '../models/i-register-request.model';
import { IMessageResponse } from '../models/i-message-response.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private readonly httpClient: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  customerRegister(body: IRegisterRequest): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>(`${this.apiBaseUrl}/customer/register`, body)
      .pipe(tap(response => this.setAuth(response.token, response.user)));
  }

  customerLogin(body: ILoginRequest): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>(`${this.apiBaseUrl}/customer/login`, body)
      .pipe(tap(response => this.setAuth(response.token, response.user)));
  }

  customerLogout(): Observable<IMessageResponse> {
    return this.httpClient
      .post<IMessageResponse>(`${this.apiBaseUrl}/customer/logout`, {})
      .pipe(tap(() => this.clearAuth()));
  }

  customerMe(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.apiBaseUrl}/customer/me`);
  }

  adminRegister(body: IRegisterRequest): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>(`${this.apiBaseUrl}/admin/register`, body)
      .pipe(tap(response => this.setAuth(response.token, response.user)));
  }

  adminLogin(body: ILoginRequest): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>(`${this.apiBaseUrl}/admin/login`, body)
      .pipe(tap(response => this.setAuth(response.token, response.user)));
  }

  adminLogout(): Observable<IMessageResponse> {
    return this.httpClient
      .post<IMessageResponse>(`${this.apiBaseUrl}/admin/logout`, {})
      .pipe(tap(() => this.clearAuth()));
  }

  adminMe(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.apiBaseUrl}/admin/me`);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): IUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as IUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): 'admin' | 'customer' | null {
    return this.getUser()?.role ?? null;
  }

  setAuth(token: string, user: IUser): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
