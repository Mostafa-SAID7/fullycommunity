import { NotificationType } from '../../types';

/**
 * Notification/Toast interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  timestamp: Date;
}

/**
 * In-app notification interface (bell icon notifications)
 */
export interface InAppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  actionUrl?: string | null;
  createdAt: string;
}
