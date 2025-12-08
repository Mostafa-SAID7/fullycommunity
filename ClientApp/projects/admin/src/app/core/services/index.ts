/**
 * Central export file for all services
 * Organized by domain
 */

// Admin Services
export * from './admin/users.service';
export * from './admin/moderation.service';
export * from './admin/reports.service';
export * from './admin/role.service';
export * from './admin/settings.service';

// Auth Services
export * from './auth/auth.service';

// Dashboard Services
export * from './dashboard/dashboard.service';

// Notification Services
export * from './notifications/notification.service';

// Content Services
export * from './content/admin-content.service';

// Content - Community
export * from './content/community/qa/qa-admin.service';
export * from './content/community/posts/posts-admin.service';
export * from './content/community/pages/pages-admin.service';
export * from './content/community/groups/groups-admin.service';
export * from './content/community/events/events-admin.service';

// Content - Media
export * from './content/podcasts/podcast.service';
export * from './content/videos/videos-admin.service';

// Marketplace Services
export * from './marketplace/products/products-admin.service';
export * from './marketplace/orders/orders-admin.service';

// Services Management
export * from './services/services-admin.service';
