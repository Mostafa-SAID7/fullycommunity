/**
 * Generic user action flags
 * Used to track current user's interactions with content
 */
export interface UserActionFlags {
  isLikedByCurrentUser?: boolean;
  isBookmarkedByCurrentUser?: boolean;
  isFollowedByCurrentUser?: boolean;
  isSavedByCurrentUser?: boolean;
  currentUserVote?: number; // For QA: -1 (downvote), 0 (no vote), 1 (upvote)
}
