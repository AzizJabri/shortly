import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/requests/login-request';
import { RegisterRequest } from '../models/requests/register-request';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/responses/login-response';
import { User } from '../models/user';
import { MeResponse } from '../models/responses/me-response';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  public isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private _client: HttpClient) {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.me().pipe(
        tap(response => {
          if (response && response.type === 'success') {
            this.setUserData(response.user);
          } else {
            this.clearUserData();
          }
        }),
        finalize(() => this.isLoadingSubject.next(false))
      ).subscribe();
    } else {
      this.isLoadingSubject.next(false);
    }
  }


  login(payload: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post<LoginResponse>(`${environment.BASE_URL}/auth/login`, { email: payload.email, password: payload.password })
      .pipe(
        tap((response) => {
          if (response.type === 'success') {
            this.setUserData(response.user);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
          }
        }),
        finalize(() => this.isLoadingSubject.next(false)) // Stop loading
      );
  }

  register(payload: RegisterRequest): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post(`${environment.BASE_URL}/auth/register`, { email: payload.email, password: payload.password })
      .pipe(
        finalize(() => this.isLoadingSubject.next(false)) // Stop loading
      );
  }

  me(): Observable<MeResponse> {
    return this._client.get<MeResponse>(`${environment.BASE_URL}/auth/me`);
  }

  refreshToken(refresh_token: string): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post(`${environment.BASE_URL}/auth/refresh`, { refresh_token: refresh_token })
      .pipe(
        finalize(() => this.isLoadingSubject.next(false)) // Stop loading
      );
  }

  setUserData(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUserData() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  logout() {
    this.clearUserData();
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}
