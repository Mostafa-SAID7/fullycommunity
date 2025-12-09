import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UpdateProfileRequest,
  ExternalLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  Verify2FaRequest,
  Enable2FaResponse
} from '../../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(res => this.setSession(res)));
  }

  register(request: RegisterRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap(res => this.setSession(res)));
  }

  externalLogin(request: ExternalLoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/external`, request)
      .pipe(tap(res => this.setSession(res)));
  }

  forgotPassword(request: ForgotPasswordRequest) {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest) {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.post<void>(`${this.apiUrl}/change-password`, request);
  }

  refreshToken(request: RefreshTokenRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, request)
      .pipe(tap(res => this.setSession(res)));
  }

  sendOtp(request: SendOtpRequest) {
    return this.http.post<void>(`${this.apiUrl}/send-otp`, request);
  }

  verifyOtp(request: VerifyOtpRequest) {
    return this.http.post<boolean>(`${this.apiUrl}/verify-otp`, request);
  }

  enable2Fa() {
    return this.http.post<Enable2FaResponse>(`${this.apiUrl}/2fa/enable`, {});
  }

  verify2Fa(request: Verify2FaRequest) {
    return this.http.post<boolean>(`${this.apiUrl}/2fa/verify`, request);
  }

  disable2Fa() {
    return this.http.post<void>(`${this.apiUrl}/2fa/disable`, {});
  }

  updateProfile(request: UpdateProfileRequest) {
    return this.http.put<void>(`${this.apiUrl}/me`, request).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          // Only update non-null values
          const updated: User = {
            ...user,
            ...(request.firstName && { firstName: request.firstName }),
            ...(request.lastName && { lastName: request.lastName })
          };
          localStorage.setItem('user', JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setSession(res: LoginResponse) {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser() {
    const user = localStorage.getItem('user');
    if (user) this.currentUser.set(JSON.parse(user));
  }
}
