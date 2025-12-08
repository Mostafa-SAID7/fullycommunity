/**
 * Central export file for all interfaces
 * Organized by domain
 */

// Base
export * from './base/entity.interface';
export * from './base/api-response.interface';

// Common
export * from './common/enums.interface';
export * from './common/pagination.interface';
export * from './common/constants.interface';

// Admin
export * from './admin/users.interface';
export * from './admin/moderation.interface';
export * from './admin/reports.interface';
export * from './admin/role.interface';
export * from './admin/settings.interface';

// Auth
export * from './auth/auth.interface';

// Dashboard
export * from './dashboard/dashboard.interface';

// Notifications
export * from './notifications/notification.interface';

// Content
export * from './content/admin-content.interface';

// Content - Community
export * from './content/community/qa/qa-admin.interface';
export * from './content/community/posts/posts-admin.interface';
export * from './content/community/pages/pages-admin.interface';
export * from './content/community/groups/groups-admin.interface';
export * from './content/community/events/events-admin.interface';

// Content - Media
export * from './content/podcasts/podcast.interface';
export * from './content/videos/videos-admin.interface';

// Marketplace
export * from './marketplace/products/product-admin.interface';
export * from './marketplace/orders/order-admin.interface';

// Services
export * from './services/service-admin.interface';
