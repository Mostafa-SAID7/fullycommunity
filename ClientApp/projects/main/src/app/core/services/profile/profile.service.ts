import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserProfile,
  PublicProfile,
  UpdateProfileRequest,
  UpdateAvatarRequest,
  UpdateBackgroundRequest,
  UpdateBannerRequest,
  VerifyEmailRequest,
  VerifyPhoneRequest,
  ChangeEmailRequest,
  ChangePhoneRequest
} from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  /**
   * Get current user profile
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  /**
   * Get user profile by ID
   */
  getProfile(userId: string): Observable<PublicProfile> {
    return this.http.get<PublicProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get user profile by username
   */
  getProfileByUsername(username: string): Observable<PublicProfile> {
    return this.http.get<PublicProfile>(`${this.apiUrl}/username/${username}`);
  }

  /**
   * Update profile
   */
  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}`, request);
  }

  /**
   * Update avatar
   */
  updateAvatar(request: UpdateAvatarRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/avatar`, request);
  }

  /**
   * Update background
   */
  updateBackground(request: UpdateBackgroundRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/background`, request);
  }

  /**
   * Update banner
   */
  updateBanner(request: UpdateBannerRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/banner`, request);
  }

  /**
   * Delete avatar
   */
  deleteAvatar(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/avatar`);
  }

  /**
   * Delete background
   */
  deleteBackground(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/background`);
  }

  /**
   * Verify email
   */
  verifyEmail(request: VerifyEmailRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, request);
  }

  /**
   * Resend email verification
   */
  resendEmailVerification(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resend-email-verification`, {});
  }

  /**
   * Verify phone
   */
  verifyPhone(request: VerifyPhoneRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-phone`, request);
  }

  /**
   * Send phone verification code
   */
  sendPhoneVerification(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send-phone-verification`, {});
  }

  /**
   * Change email
   */
  changeEmail(request: ChangeEmailRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-email`, request);
  }

  /**
   * Change phone
   */
  changePhone(request: ChangePhoneRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-phone`, request);
  }

  /**
   * Check username availability
   */
  checkUsername(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/check-username`, {
      params: { username }
    });
  }

  /**
   * Search profiles
   */
  searchProfiles(query: string, page: number = 1, pageSize: number = 20): Observable<PublicProfile[]> {
    return this.http.get<PublicProfile[]>(`${this.apiUrl}/search`, {
      params: {
        query,
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }
}
