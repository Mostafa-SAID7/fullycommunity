import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../types/common.types';
import {
  QuestionDto,
  QuestionListDto,
  QuestionFilter,
  QuestionStatus,
  QuestionAuthor,
  QuestionCategory,
  TrendingQuestionDto,
  AnswerDto,
  AnswerCommentDto,
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
  questions = signal<QuestionListDto[]>([]);
  loading = signal(false);

  // ============================================================================
  // QUESTION OPERATIONS
  // ============================================================================

  getQuestions(filter: QuestionFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    return this.questionService.getQuestions(filter, page, pageSize);
  }

  getQuestion(id: string): Observable<QuestionDto> {
    return this.questionService.getQuestion(id);
  }

  getQuestionBySlug(slug: string): Observable<QuestionDto> {
    return this.questionService.getQuestionBySlug(slug);
  }

  getUserQuestions(userId: string, page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    return this.questionService.getUserQuestions(userId, page, pageSize);
  }

  getRelatedQuestions(questionId: string, count = 5): Observable<QuestionListDto[]> {
    return this.questionService.getRelatedQuestions(questionId, count);
  }

  createQuestion(request: CreateQuestionRequest): Observable<QuestionDto> {
    return this.questionService.createQuestion(request);
  }

  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<QuestionDto> {
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

  getBookmarks(page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    return this.questionService.getBookmarks(page, pageSize);
  }

  getCategories(): Observable<QuestionCategory[]> {
    return this.questionService.getCategories();
  }

  // ============================================================================
  // ANSWER OPERATIONS
  // ============================================================================

  getAnswers(questionId: string): Observable<AnswerDto[]> {
    return this.answerService.getAnswers(questionId);
  }

  createAnswer(questionId: string, request: CreateAnswerRequest): Observable<AnswerDto> {
    return this.answerService.createAnswer(questionId, request);
  }

  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<AnswerDto> {
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

  getAnswerComments(answerId: string): Observable<AnswerCommentDto[]> {
    return this.answerService.getAnswerComments(answerId);
  }

  createAnswerComment(answerId: string, request: CreateCommentRequest): Observable<AnswerCommentDto> {
    return this.answerService.createAnswerComment(answerId, request);
  }

  updateAnswerComment(commentId: string, request: UpdateCommentRequest): Observable<AnswerCommentDto> {
    return this.answerService.updateAnswerComment(commentId, request);
  }

  deleteAnswerComment(commentId: string): Observable<void> {
    return this.answerService.deleteAnswerComment(commentId);
  }

  // ============================================================================
  // TRENDING OPERATIONS
  // ============================================================================

  getTrendingQuestions(count = 5): Observable<TrendingQuestionDto[]> {
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
  hasBounty(question: QuestionDto): boolean {
    return !!question.bountyPoints && question.bountyPoints > 0;
  }

  /**
   * Check if bounty is expired
   */
  isBountyExpired(question: QuestionDto): boolean {
    if (!question.bountyExpiresAt) return false;
    return new Date(question.bountyExpiresAt) < new Date();
  }

  /**
   * Get question status badge color
   */
  getStatusColor(status: QuestionStatus): string {
    switch (status) {
      case 'Open': return 'blue';
      case 'Answered': return 'green';
      case 'Closed': return 'gray';
      case 'Duplicate': return 'yellow';
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
