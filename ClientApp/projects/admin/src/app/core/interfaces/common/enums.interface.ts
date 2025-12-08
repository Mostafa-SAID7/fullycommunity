/**
 * Common Enums and Types
 */

export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

export type ContentStatus = 'published' | 'draft' | 'pending' | 'rejected' | 'archived';

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ServiceStatus = 'available' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
