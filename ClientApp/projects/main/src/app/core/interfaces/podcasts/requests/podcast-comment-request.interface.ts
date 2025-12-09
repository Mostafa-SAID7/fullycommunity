/**
 * Create Comment Request
 */
export interface CreateCommentRequest {
  content: string;
  timestamp: string | null; // TimeSpan
  parentCommentId: string | null;
}
