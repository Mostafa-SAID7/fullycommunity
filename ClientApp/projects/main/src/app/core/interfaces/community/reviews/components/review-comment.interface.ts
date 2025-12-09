// Interface matching backend DTO: ReviewCommentDto

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  content: string;
  parentId: string | null;
  likeCount: number;
  createdAt: string;
}
