import { PostAuthor } from './post-author.interface';

/**
 * Post Comment DTO - matches PostCommentDto.cs from backend
 */
export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  author: PostAuthor;
  content: string;
  likeCount: number;
  isLiked: boolean;
  parentId: string | null;
  replies: PostComment[] | null;
  createdAt: string;
}
