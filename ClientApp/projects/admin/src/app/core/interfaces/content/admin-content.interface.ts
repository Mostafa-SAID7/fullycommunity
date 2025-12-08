export type ContentType = 'post' | 'review' | 'guide' | 'question' | 'podcast';
export type ContentStatus = 'published' | 'draft' | 'pending' | 'rejected';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface ContentListResponse {
  items: ContentItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ContentStats {
  totalPosts: number;
  totalReviews: number;
  totalGuides: number;
  totalQuestions: number;
  totalPodcasts: number;
  pendingApproval: number;
}

export interface ContentActionRequest {
  reason?: string;
}
