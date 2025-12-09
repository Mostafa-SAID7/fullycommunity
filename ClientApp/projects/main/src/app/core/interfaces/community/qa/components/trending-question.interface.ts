import { QuestionAuthor } from './question-author.interface';

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
