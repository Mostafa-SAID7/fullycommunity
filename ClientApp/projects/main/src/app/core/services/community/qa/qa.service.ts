import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../types/common.types';
import {
  Question,
  QuestionList,
  QuestionFilter,
  QuestionStatus,
  QuestionAuthor,
  QuestionCategory,
  TrendingQuestion,
  Answer,
  AnswerComment,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  CreateCommentRequest,
  UpdateCommentRequest
} from '../../../interfaces/community/qa';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { TrendingService } from './trending.service';

/**
 * Main Q&A Service - Facade pattern
 * Delegates to specialized services for better organization
 */
@Injectable({ providedIn: 'root' })
export class QAService {
  private questionService = inject(QuestionService);
  private answerService = inject(AnswerService);
  private trendingService = inject(TrendingService);

  // Signals for state management
  questions = signal<QuestionList[]>([]);
  loading = signal(false);

  // ============================================================================
  // QUESTION OPERATIONS
  // ============================================================================

  getQuestions(filter: QuestionFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<QuestionList>> {
    return this.questionService.getQuestions(filter, page, pageSize);
  }

  getQuestion(id: string): Observable<Question> {
    return this.questionService.getQuestion(id);
  }

  getQuestionBySlug(slug: string): Observable<Question> {
    return this.questionService.getQuestionBySlug(slug);
  }

  getUserQuestions(userId: string, page = 1, pageSize = 20): Observable<PagedResult<QuestionList>> {
    return this.questionService.getUserQuestions(userId, page, pageSize);
  }

  getRelatedQuestions(questionId: string, count = 5): Observable<QuestionList[]> {
    return this.questionService.getRelatedQuestions(questionId, count);
  }

  createQuestion(request: CreateQuestionRequest): Observable<Question> {
    return this.questionService.createQuestion(request);
  }

  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<Question> {
    return this.questionService.updateQuestion(id, request);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.questionService.deleteQuestion(id);
  }

  closeQuestion(id: string, reason: string): Observable<void> {
    return this.questionService.closeQuestion(id, reason);
  }

  voteQuestion(id: string, voteType: 1 | -1): Observable<{ voteCount: number }> {
    return this.questionService.voteQuestion(id, voteType);
  }

  bookmarkQuestion(id: string): Observable<void> {
    return this.questionService.bookmarkQuestion(id);
  }

  unbookmarkQuestion(id: string): Observable<void> {
    return this.questionService.unbookmarkQuestion(id);
  }

  getBookmarks(page = 1, pageSize = 20): Observable<PagedResult<QuestionList>> {
    return this.questionService.getBookmarks(page, pageSize);
  }

  getCategories(): Observable<QuestionCategory[]> {
    return this.questionService.getCategories();
  }

  // ============================================================================
  // ANSWER OPERATIONS
  // ============================================================================

  getAnswers(questionId: string): Observable<Answer[]> {
    return this.answerService.getAnswers(questionId);
  }

  createAnswer(questionId: string, request: CreateAnswerRequest): Observable<Answer> {
    return this.answerService.createAnswer(questionId, request);
  }

  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<Answer> {
    return this.answerService.updateAnswer(id, request);
  }

  deleteAnswer(id: string): Observable<void> {
    return this.answerService.deleteAnswer(id);
  }

  acceptAnswer(id: string): Observable<void> {
    return this.answerService.acceptAnswer(id);
  }

  voteAnswer(id: string, voteType: 1 | -1): Observable<{ voteCount: number }> {
    return this.answerService.voteAnswer(id, voteType);
  }

  // ============================================================================
  // COMMENT OPERATIONS
  // ============================================================================

  getAnswerComments(answerId: string): Observable<AnswerComment[]> {
    return this.answerService.getAnswerComments(answerId);
  }

  createAnswerComment(answerId: string, request: CreateCommentRequest): Observable<AnswerComment> {
    return this.answerService.createAnswerComment(answerId, request);
  }

  updateAnswerComment(commentId: string, request: UpdateCommentRequest): Observable<AnswerComment> {
    return this.answerService.updateAnswerComment(commentId, request);
  }

  deleteAnswerComment(commentId: string): Observable<void> {
    return this.answerService.deleteAnswerComment(commentId);
  }

  // ============================================================================
  // TRENDING OPERATIONS
  // ============================================================================

  getTrendingQuestions(count = 5): Observable<TrendingQuestion[]> {
    return this.trendingService.getTrendingQuestions(count);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get full author name for display from QuestionAuthor object
   */
  getAuthorName(author: QuestionAuthor): string {
    return `${author.firstName} ${author.lastName}`.trim();
  }

  /**
   * Check if question has bounty
   */
  hasBounty(question: Question): boolean {
    return !!question.bountyPoints && question.bountyPoints > 0;
  }

  /**
   * Check if bounty is expired
   */
  isBountyExpired(question: Question): boolean {
    if (!question.bountyExpiresAt) return false;
    return new Date(question.bountyExpiresAt) < new Date();
  }

  /**
   * Get question status badge color
   */
  getStatusColor(status: QuestionStatus): string {
    switch (status) {
      case QuestionStatus.Open: return 'blue';
      case QuestionStatus.Answered: return 'green';
      case QuestionStatus.Closed: return 'gray';
      case QuestionStatus.Duplicate: return 'yellow';
      default: return 'gray';
    }
  }

  /**
   * Check if user has upvoted
   */
  isUpvoted(currentUserVote: number): boolean {
    return currentUserVote === 1;
  }

  /**
   * Check if user has downvoted
   */
  isDownvoted(currentUserVote: number): boolean {
    return currentUserVote === -1;
  }
}
