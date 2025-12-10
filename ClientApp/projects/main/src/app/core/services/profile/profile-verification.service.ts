import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  VerificationRequest,
  VerificationBadge,
  SubmitVerificationRequest
} from '../../interfaces/profile/profile-verification.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileVerificationService {
  private readonly apiUrl = `${environment.apiUrl}/profile/verification`;

  constructor(private http: HttpClient) {}

  /**
   * Get verification status
   */
  getVerificationStatus(): Observable<VerificationRequest | null> {
    return this.http.get<VerificationRequest | null>(`${this.apiUrl}/status`);
  }

  /**
   * Submit verification request
   */
  submitVerificationRequest(request: SubmitVerificationRequest): Observable<VerificationRequest> {
    return this.http.post<VerificationRequest>(this.apiUrl, request);
  }

  /**
   * Get verification badges
   */
  getVerificationBadges(userId: string): Observable<VerificationBadge[]> {
    return this.http.get<VerificationBadge[]>(`${this.apiUrl}/${userId}/badges`);
  }

  /**
   * Cancel verification request
   */
  cancelVerificationRequest(requestId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${requestId}`);
  }

  /**
   * Upload verification document
   */
  uploadDocument(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-document`, formData);
  }
}
