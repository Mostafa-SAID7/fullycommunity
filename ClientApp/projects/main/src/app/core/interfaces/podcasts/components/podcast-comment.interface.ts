/**
 * Episode Comment
 */
export interface EpisodeComment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  content: string;
  timestamp: string | null; // TimeSpan
  parentCommentId: string | null;
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: string;
  replies: EpisodeComment[] | null;
}
