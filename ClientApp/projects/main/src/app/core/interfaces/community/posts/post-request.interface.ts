import { PostType } from './post.enums';

/**
 * Create Post Request - matches CreatePostRequest.cs from backend
 */
export interface CreatePostRequest {
  title: string;
  content: string;
  type?: PostType;
  visibility?: string;
  categoryId?: string | null;
  tags?: string[] | null;
  groupId?: string | null;
  mediaUrls?: string[] | null;
}

/**
 * Update Post Request - matches UpdatePostRequest.cs from backend
 */
export interface UpdatePostRequest {
  title?: string | null;
  content?: string | null;
  type?: PostType | null;
  visibility?: string | null;
  categoryId?: string | null;
  tags?: string[] | null;
  mediaUrls?: string[] | null;
}

/**
 * Create Comment Request - matches CreateCommentRequest.cs from backend
 */
export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}
