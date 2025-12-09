/**
 * Question Author DTO - matches QuestionAuthorDto.cs from backend
 */
export interface QuestionAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  userType: string;
}
