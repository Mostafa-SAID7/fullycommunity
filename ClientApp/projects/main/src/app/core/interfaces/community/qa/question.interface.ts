import { QuestionStatus } from './enums';

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
