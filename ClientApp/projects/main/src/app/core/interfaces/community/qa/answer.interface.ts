/**
 * Answer-related interfaces matching backend DTOs
 */

import { AnswerComment } from './comment.interface';

export interface AnswerDto {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  voteCount: number;
  isAccepted: boolean;
  acceptedAt?: string;
  currentUserVote: number; // 0 = no vote, 1 = upvote, -1 = downvote
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string; // For edited timestamp
  comments: AnswerComment[];
}
