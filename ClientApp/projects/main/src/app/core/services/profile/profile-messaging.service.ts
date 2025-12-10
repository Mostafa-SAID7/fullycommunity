import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ProfileMessage,
  ContactForm,
  ContactSubmission,
  Testimonial,
  SendMessageRequest,
  SubmitContactRequest,
  AddTestimonialRequest
} from '../../interfaces/profile/profile-messaging.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileMessagingService {
  private readonly apiUrl = `${environment.apiUrl}/profile/messaging`;

  constructor(private http: HttpClient) {}

  /**
   * Get messages
   */
  getMessages(page: number = 1, pageSize: number = 20): Observable<PagedResult<ProfileMessage>> {
    return this.http.get<PagedResult<ProfileMessage>>(`${this.apiUrl}/messages`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Send message
   */
  sendMessage(request: SendMessageRequest): Observable<ProfileMessage> {
    return this.http.post<ProfileMessage>(`${this.apiUrl}/messages`, request);
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/messages/${messageId}/read`, {});
  }

  /**
   * Delete message
   */
  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/messages/${messageId}`);
  }

  /**
   * Get contact form
   */
  getContactForm(userId: string): Observable<ContactForm> {
    return this.http.get<ContactForm>(`${this.apiUrl}/${userId}/contact-form`);
  }

  /**
   * Update contact form
   */
  updateContactForm(form: Partial<ContactForm>): Observable<ContactForm> {
    return this.http.put<ContactForm>(`${this.apiUrl}/contact-form`, form);
  }

  /**
   * Submit contact form
   */
  submitContactForm(request: SubmitContactRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/contact-form/submit`, request);
  }

  /**
   * Get contact submissions
   */
  getContactSubmissions(page: number = 1, pageSize: number = 20): Observable<PagedResult<ContactSubmission>> {
    return this.http.get<PagedResult<ContactSubmission>>(`${this.apiUrl}/contact-submissions`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Mark submission as read
   */
  markSubmissionAsRead(submissionId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/contact-submissions/${submissionId}/read`, {});
  }

  /**
   * Delete submission
   */
  deleteSubmission(submissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contact-submissions/${submissionId}`);
  }

  /**
   * Get testimonials
   */
  getTestimonials(userId: string): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/${userId}/testimonials`);
  }

  /**
   * Add testimonial
   */
  addTestimonial(request: AddTestimonialRequest): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}/testimonials`, request);
  }

  /**
   * Approve testimonial
   */
  approveTestimonial(testimonialId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/testimonials/${testimonialId}/approve`, {});
  }

  /**
   * Reject testimonial
   */
  rejectTestimonial(testimonialId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/testimonials/${testimonialId}/reject`, {});
  }

  /**
   * Delete testimonial
   */
  deleteTestimonial(testimonialId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testimonials/${testimonialId}`);
  }
}