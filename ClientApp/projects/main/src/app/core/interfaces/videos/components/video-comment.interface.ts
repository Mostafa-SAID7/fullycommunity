import { CommentStatus, ReactionType } from '../enums/video-enums';

/**
 * Video Comment
 */
export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  userIsVerified: boolean;
  content: string;
  status: CommentStatus;
  likeCount: number;
  replyCount: number;
  parentCommentId: string | null;
  isPinned: boolean;
  isEdited: boolean;
  isLikedByUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Video Reaction
 */
export interface VideoReaction {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  reactionType: ReactionType;
  createdAt: string;
}
