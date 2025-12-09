import { PostAuthor } from './post-author.interface';
import { PostMedia } from './post-media.interface';
import { PostType } from '../enums';

/**
 * Post List DTO - matches PostListDto.cs from backend
 * Used for list views with minimal data
 */
export interface PostList {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  content: string;
  slug: string | null;
  type: PostType;
  coverImageUrl: string | null;
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  publishedAt: string | null;
  createdAt: string;
}
