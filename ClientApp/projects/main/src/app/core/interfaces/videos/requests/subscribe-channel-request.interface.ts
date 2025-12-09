/**
 * Subscribe Channel Request
 */
export interface SubscribeChannelRequest {
  channelId: string;
  notificationsEnabled?: boolean;
}

/**
 * Unsubscribe Channel Request
 */
export interface UnsubscribeChannelRequest {
  channelId: string;
}

/**
 * Update Subscription Request
 */
export interface UpdateSubscriptionRequest {
  notificationsEnabled: boolean;
}
