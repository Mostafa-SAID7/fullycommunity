import { LiveRecordingStatus } from '../enums/podcast-enums';

/**
 * Live Recording
 */
export interface LiveRecording {
  id: string;
  podcastShowId: string;
  podcastTitle: string;
  podcastCoverImageUrl: string | null;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  status: LiveRecordingStatus;
  scheduledStartAt: string | null;
  actualStartAt: string | null;
  endedAt: string | null;
  duration: string | null; // TimeSpan
  playbackUrl: string | null;
  peakViewers: number;
  totalViewers: number;
  currentViewers: number;
  chatMessageCount: number;
  totalTips: number;
  allowChat: boolean;
  allowTips: boolean;
  isSubscribersOnly: boolean;
  resultingEpisodeId: string | null;
  createdAt: string;
}

/**
 * Live Recording List Item
 */
export interface LiveRecordingListItem {
  id: string;
  podcastShowId: string;
  podcastTitle: string;
  podcastCoverImageUrl: string | null;
  title: string;
  thumbnailUrl: string | null;
  status: LiveRecordingStatus;
  scheduledStartAt: string | null;
  currentViewers: number;
  isSubscribersOnly: boolean;
}

/**
 * Stream Credentials
 */
export interface StreamCredentials {
  streamUrl: string;
  streamKey: string;
  expiresAt: string;
}

/**
 * Live Chat Message
 */
export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  message: string;
  sentAt: string;
  replyToId: string | null;
  replyToUserName: string | null;
  isPinned: boolean;
  isHighlighted: boolean;
  isHost: boolean;
  isModerator: boolean;
  isSubscriber: boolean;
}

/**
 * Live Tip
 */
export interface LiveTip {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string | null;
  amount: number;
  currency: string;
  message: string | null;
  sentAt: string;
  isHighlighted: boolean;
  wasReadOnAir: boolean;
}
