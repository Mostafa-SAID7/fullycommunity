import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AnswerComment, CreateCommentRequest, UpdateCommentRequest } from '../../../interfaces/community/qa/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/community/qa/answers`;

  getComments(answerId: string): Observable<AnswerComment[]> {
    return this.http.get<{ data: AnswerComment[] }>(`${this.apiUrl}/${answerId}/comments`)
      .pipe(map(response => response.data));
  }

  addComment(answerId: string, request: CreateCommentRequest): Observable<AnswerComment> {
    return this.http.post<{ data: AnswerComment }>(`${this.apiUrl}/${answerId}/comments`, request)
      .pipe(map(response => response.data));
  }

  updateComment(commentId: string, request: UpdateCommentRequest): Observable<AnswerComment> {
    return this.http.put<{ data: AnswerComment }>(`${this.apiUrl}/comments/${commentId}`, request)
      .pipe(map(response => response.data));
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }
}
