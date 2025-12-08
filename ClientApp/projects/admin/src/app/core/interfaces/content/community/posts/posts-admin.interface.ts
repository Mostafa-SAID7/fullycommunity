export type PostStatus = 'published' | 'draft' | 'archived';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  status: PostStatus;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface PostsListResponse {
  items: Post[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface PostActionRequest {
  reason?: string;
}
