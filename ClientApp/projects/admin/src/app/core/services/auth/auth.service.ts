import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  RefreshTokenRequest,
  UploadAvatarResponse
} from '../../interfaces/auth/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUser();
  }

  login(email: string, password: string) {
    const request: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(res => this.setSession(res)));
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap(res => this.setSession(res)));
  }

  updateProfile(data: UpdateProfileRequest) {
    return this.http.put<void>(`${this.apiUrl}/me`, data).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, ...data };
          localStorage.setItem('admin_user', JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadAvatarResponse>(`${this.apiUrl}/me/avatar`, formData).pipe(
      tap(res => {
        const user = this.currentUser();
        if (user) {
          // Prepend API URL if the avatar URL is relative
          const fullAvatarUrl = res.avatarUrl.startsWith('http') 
            ? res.avatarUrl 
            : `${environment.apiUrl}${res.avatarUrl}`;
          const updated = { ...user, avatarUrl: fullAvatarUrl };
          localStorage.setItem('admin_user', JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (!refreshToken) return of(null);

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        tap(res => this.setSession(res)),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  logout() {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.roles?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('SuperAdmin') || this.hasRole('Admin') || 
           this.hasRole('Moderator') || this.hasRole('UserAdmin') || 
           this.hasRole('ContentAdmin');
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('admin_token', res.accessToken);
    localStorage.setItem('admin_refresh_token', res.refreshToken);
    // Fix avatar URL if relative
    const user = { ...res.user };
    if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
      user.avatarUrl = `${environment.apiUrl}${user.avatarUrl}`;
    }
    localStorage.setItem('admin_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser() {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Fix avatar URL if relative
        if (user.avatarUrl && !user.avatarUrl.startsWith('http')) {
          user.avatarUrl = `${environment.apiUrl}${user.avatarUrl}`;
        }
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem('admin_user');
      }
    }
  }
}
