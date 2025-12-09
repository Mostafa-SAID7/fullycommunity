import { PostType } from '../enums';

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
