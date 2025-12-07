/**
 * Request DTOs for Q&A operations
 */

export interface CreateQuestionRequest {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  categoryId?: string;
  tags?: string[];
}

export interface CreateAnswerRequest {
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface CreateCommentRequest {
  content: string; // Max 500 characters
}

export interface UpdateCommentRequest {
  content: string; // Max 500 characters
}
