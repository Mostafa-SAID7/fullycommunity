/**
 * Question-related interfaces matching backend DTOs
 */

export interface QuestionDto {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  title: string;
  content: string;
  slug?: string;
  status: QuestionStatus;
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  bookmarkCount: number;
  acceptedAnswerId?: string;
  bountyPoints?: number;
  bountyExpiresAt?: string;
  isClosed: boolean;
  currentUserVote: number; // 0 = no vote, 1 = upvote, -1 = downvote
  isBookmarkedByCurrentUser: boolean;
  createdAt: string;
}

export interface QuestionListDto {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  status: QuestionStatus;
  answerCount: number;
  voteCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  tags: string[];
  createdAt: string;
}

export interface TrendingQuestionDto {
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

export interface QuestionAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
}

export type QuestionStatus = 'Open' | 'Answered' | 'Closed' | 'Duplicate';

export interface QuestionFilter {
  status?: QuestionStatus;
  categoryId?: string;
  searchTerm?: string;
  tag?: string;
  hasAcceptedAnswer?: boolean;
  hasBounty?: boolean;
  sortBy?: 'newest' | 'votes' | 'views' | 'active' | 'unanswered';
}
