/**
 * Comment-related interfaces matching backend DTOs
 */

export interface AnswerCommentDto {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
