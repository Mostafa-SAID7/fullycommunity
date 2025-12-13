import { QuestionStatus } from '../enums';

/**
 * Question List DTO - matches QuestionListDto.cs from backend
 */
export interface QuestionListDto {
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

export type QuestionList = QuestionListDto;
