import { AnswerComment } from './answer-comment.interface';

/**
 * Answer DTO - matches AnswerDto.cs from backend
 */
export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  content: string;
  voteCount: number;
  isAccepted: boolean;
  acceptedAt: string | null;
  currentUserVote: number;
  isEdited: boolean;
  createdAt: string;
  comments: AnswerComment[];
}
