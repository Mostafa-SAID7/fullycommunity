import { ReactionType } from '../enums/video-enums';

/**
 * Add Reaction Request
 */
export interface AddReactionRequest {
  videoId: string;
  reactionType: ReactionType;
}

/**
 * Remove Reaction Request
 */
export interface RemoveReactionRequest {
  videoId: string;
}
