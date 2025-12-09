import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ReviewStats,
  ReviewSubjectType
} from '../../../interfaces/community/reviews';

@Injectable({ providedIn: 'root' })
export class ReviewStatsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/reviews`;

  // ============================================================================
  // STATS OPERATIONS
  // ============================================================================

  getReviewStats(subjectType: ReviewSubjectType, subjectId: string): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/stats`, {
      params: { subjectType: subjectType.toString(), subjectId }
    });
  }
}
