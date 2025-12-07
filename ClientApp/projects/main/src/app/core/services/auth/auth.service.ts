import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor?: boolean;
  requiresVerification?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.setSession(res)));
  }

  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap(res => this.setSession(res)));
  }

  externalLogin(data: { provider: string; providerKey: string; email?: string; firstName?: string; lastName?: string; deviceId?: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/external`, data)
      .pipe(tap(res => this.setSession(res)));
  }

  updateProfile(data: { firstName?: string; lastName?: string; phoneNumber?: string }) {
    return this.http.put<void>(`${this.apiUrl}/me`, data).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, ...data };
          localStorage.setItem('user', JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
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

  private setSession(res: AuthResponse) {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser() {
    const user = localStorage.getItem('user');
    if (user) this.currentUser.set(JSON.parse(user));
  }
}
