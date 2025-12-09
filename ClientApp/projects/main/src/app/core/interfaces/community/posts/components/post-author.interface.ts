/**
 * Post Author DTO - matches PostAuthorDto.cs from backend
 */
export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  userType: string;
}
