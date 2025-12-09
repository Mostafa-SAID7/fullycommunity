import { BaseFilter } from '../../../../types';
import { PostType, PostVisibility } from '../enums';

/**
 * Post Filter - matches PostFilter record from backend
 */
export interface PostFilter extends BaseFilter {
  type?: PostType | null;
  categoryId?: string | null;
  visibility?: PostVisibility | null;
  tag?: string | null;
  isFeatured?: boolean | null;
}
