/**
 * Answer Comment DTO - matches AnswerCommentDto.cs from backend
 */
export interface AnswerComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
