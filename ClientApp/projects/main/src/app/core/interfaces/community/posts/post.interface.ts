import { PostAuthor } from './post-author.interface';
import { PostMedia } from './post-media.interface';
import { PostCategory } from './post-category.interface';
import { PostType } from './post.enums';

/**
 * Full Post DTO - matches PostDto.cs from backend
 */
export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  content: string;
  slug: string | null;
  type: PostType;
  status: string;
  visibility: string;
  coverImageUrl: string | null;
  media: PostMedia[];
  categoryId: string | null;
  category: PostCategory | null;
  tags: string[];
  groupId: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  allowComments: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  isLiked: boolean;
  publishedAt: string | null;
  createdAt: string;
}

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
