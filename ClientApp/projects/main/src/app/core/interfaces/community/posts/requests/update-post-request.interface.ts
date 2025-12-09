import { PostType } from '../enums';

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
