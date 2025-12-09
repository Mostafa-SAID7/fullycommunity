/**
 * Schedule Live Recording Request
 */
export interface ScheduleLiveRecordingRequest {
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  scheduledStartAt: string;
  allowChat: boolean;
  allowTips: boolean;
  recordForEpisode: boolean;
  isSubscribersOnly: boolean;
}

/**
 * Update Live Recording Request
 */
export interface UpdateLiveRecordingRequest {
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  scheduledStartAt: string | null;
  allowChat: boolean | null;
  allowTips: boolean | null;
  recordForEpisode: boolean | null;
  isSubscribersOnly: boolean | null;
}

/**
 * Send Tip Request
 */
export interface SendTipRequest {
  amount: number;
  currency: string;
  message: string | null;
  paymentMethodId: string;
}
