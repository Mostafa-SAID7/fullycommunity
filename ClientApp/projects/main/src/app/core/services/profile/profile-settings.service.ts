import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProfileSettings,
  AccountSettings,
  BlockedUser,
  UpdatePrivacySettingsRequest,
  DeactivateAccountRequest,
  DeleteAccountRequest,
  BlockUserRequest,
  ReportUserRequest
} from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {
  private readonly apiUrl = `${environment.apiUrl}/profile/settings`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile settings
   */
  getSettings(): Observable<ProfileSettings> {
    return this.http.get<ProfileSettings>(this.apiUrl);
  }

  /**
   * Update privacy settings
   */
  updatePrivacySettings(request: UpdatePrivacySettingsRequest): Observable<ProfileSettings> {
    return this.http.put<ProfileSettings>(`${this.apiUrl}/privacy`, request);
  }

  /**
   * Get account settings
   */
  getAccountSettings(): Observable<AccountSettings> {
    return this.http.get<AccountSettings>(`${this.apiUrl}/account`);
  }

  /**
   * Update account settings
   */
  updateAccountSettings(settings: Partial<AccountSettings>): Observable<AccountSettings> {
    return this.http.put<AccountSettings>(`${this.apiUrl}/account`, settings);
  }

  /**
   * Get blocked users
   */
  getBlockedUsers(): Observable<BlockedUser[]> {
    return this.http.get<BlockedUser[]>(`${this.apiUrl}/blocked-users`);
  }

  /**
   * Block user
   */
  blockUser(request: BlockUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block-user`, request);
  }

  /**
   * Unblock user
   */
  unblockUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/block-user/${userId}`);
  }

  /**
   * Report user
   */
  reportUser(request: ReportUserRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/report-user`, request);
  }

  /**
   * Deactivate account
   */
  deactivateAccount(request: DeactivateAccountRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/deactivate`, request);
  }

  /**
   * Reactivate account
   */
  reactivateAccount(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reactivate`, {});
  }

  /**
   * Delete account
   */
  deleteAccount(request: DeleteAccountRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, request);
  }

  /**
   * Download user data
   */
  downloadUserData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-data`, {
      responseType: 'blob'
    });
  }
}
