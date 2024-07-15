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

  private userSubject = new BehaviorSubject<User | undefined | null>(undefined);
  public user$ = this.userSubject.asObservable();

  public isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private _client: HttpClient) {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.me().pipe(
        tap(response => {
          console.log(response)
          if (response && response.type === 'success') {
            this.userSubject.next(response.user);
          } else {
            this.clearUserData();
          }
        }),
        finalize(() => this.isLoadingSubject.next(false))
      ).subscribe();
    } else {
      this.clearUserData();
      this.isLoadingSubject.next(false);
    }
  }


  login(payload: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post<LoginResponse>(`${environment.BASE_URL}/auth/login`, { email: payload.email, password: payload.password })
      .pipe(
        tap((response) => {
          if (response.type === 'success') {
            this.setToken(response);
            this.setUser(response.user);
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

  refreshToken(): Observable<any> {
    const refresh_token = localStorage.getItem('refresh_token');
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post(`${environment.BASE_URL}/auth/refresh`, { refresh_token: refresh_token })
      .pipe(
        finalize(() => {
          this.isLoadingSubject.next(false); // Stop loading
        }) // Stop loading
      );
  }

  verify(token: string): Observable<any> {
    this.isLoadingSubject.next(true); // Start loading
    return this._client.post(`${environment.BASE_URL}/auth/verify`, { verification_token: token })
      .pipe(
        finalize(() => this.isLoadingSubject.next(false)) // Stop loading
      );
  }

  setToken(res:any) {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
  }

  clearUserData() {
    this.userSubject.next(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  logout() {
    this.clearUserData();
  }

  get user(): User | null | undefined {
    return this.userSubject.value;
  }

  setUser(user: User | undefined | null) {
    this.userSubject.next(user);
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}
