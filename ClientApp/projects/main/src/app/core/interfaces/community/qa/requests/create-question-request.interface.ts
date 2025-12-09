export interface CreateQuestionRequest {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
}
