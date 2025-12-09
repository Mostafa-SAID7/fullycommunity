import { QuestionStatus } from './qa.enums';

/**
 * Question DTO - matches QuestionDto.cs from backend
 */
export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  title: string;
  content: string;
  slug: string | null;
  status: QuestionStatus;
  categoryId: string | null;
  categoryName: string | null;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  bookmarkCount: number;
  acceptedAnswerId: string | null;
  bountyPoints: number | null;
  bountyExpiresAt: string | null;
  isClosed: boolean;
  currentUserVote: number;
  isBookmarkedByCurrentUser: boolean;
  createdAt: string;
}

/**
 * Question List DTO - matches QuestionListDto.cs from backend
 */
export interface QuestionList {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  status: QuestionStatus;
  answerCount: number;
  voteCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  tags: string[];
  createdAt: string;
}

/**
 * Trending Question DTO - matches TrendingQuestionDto.cs from backend
 */
export interface TrendingQuestion {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: QuestionAuthor;
  voteCount: number;
  answerCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  tags: string[];
  createdAt: string;
}
