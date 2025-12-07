/**
 * Category-related interfaces matching backend DTOs
 */

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  questionCount: number;
}
