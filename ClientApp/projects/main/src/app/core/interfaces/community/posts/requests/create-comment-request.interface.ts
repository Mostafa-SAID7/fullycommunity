/**
 * Create Comment Request - matches CreateCommentRequest.cs from backend
 */
export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}
