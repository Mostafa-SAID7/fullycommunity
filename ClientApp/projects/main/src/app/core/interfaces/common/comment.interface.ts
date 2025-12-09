/**
 * Generic comment interface
 * Used across Posts, News, Reviews, QA, etc.
 */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Nested comment with replies
 */
export interface CommentWithReplies extends Comment {
  replyCount: number;
  replies: Comment[];
}
