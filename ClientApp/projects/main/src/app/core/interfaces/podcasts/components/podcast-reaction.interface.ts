/**
 * Episode Reaction Summary
 */
export interface EpisodeReactionSummary {
  totalReactions: number;
  likeCount: number;
  loveCount: number;
  insightfulCount: number;
  helpfulCount: number;
  fireCount: number;
  userReaction: string | null;
}
