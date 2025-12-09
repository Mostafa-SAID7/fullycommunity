/**
 * Question Category DTO - matches QuestionCategoryDto.cs from backend
 */
export interface QuestionCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  questionCount: number;
}
