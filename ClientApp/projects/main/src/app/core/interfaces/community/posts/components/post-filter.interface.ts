import { PostType, PostVisibility } from '../enums';

/**
 * Post Filter - matches PostFilter record from backend
 */
export interface PostFilter {
  type?: PostType | null;
  categoryId?: string | null;
  visibility?: PostVisibility | null;
  searchTerm?: string | null;
  tag?: string | null;
  isFeatured?: boolean | null;
  sortBy?: string | null;
}
