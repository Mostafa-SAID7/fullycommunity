/**
 * Create Comment Request
 */
export interface CreateCommentRequest {
  videoId: string;
  content: string;
  parentCommentId?: string;
}

/**
 * Update Comment Request
 */
export interface UpdateCommentRequest {
  content: string;
}
