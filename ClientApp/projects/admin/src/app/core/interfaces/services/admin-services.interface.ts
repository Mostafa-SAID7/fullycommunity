/**
 * Admin Services Management
 * Services administration
 */

/**
 * Moderation Status
 */
export enum ModerationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Flagged = 3,
  UnderReview = 4,
  RequiresAction = 5
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  PartiallyRefunded = 4
}

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  postCount: number;
  engagementRate: number;
}
export interface AdminService {
  id: string;
  title: string;
  description: string;
  providerId: string;
  providerName: string;
  providerVerified: boolean;
  
  // Service Details
  category: string;
  subcategory: string | null;
  price: number;
  currency: string;
  duration: number | null;
  
  // Status
  status: AdminServiceStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  viewCount: number;
  bookingCount: number;
  reviewCount: number;
  rating: number;
  reportCount: number;
  
  // Media
  imageUrls: string[];
  thumbnailUrl: string | null;
  
  // Location
  location: string | null;
  serviceArea: string | null;
  isRemote: boolean;
  
  // Availability
  isAvailable: boolean;
  workingHours: string | null;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Service Status
 */
export enum AdminServiceStatus {
  Active = 0,
  Inactive = 1,
  Paused = 2,
  Suspended = 3,
  Deleted = 4,
  Hidden = 5,
  Flagged = 6,
  Pending = 7
}

/**
 * Admin Service Provider
 */
export interface AdminServiceProvider {
  id: string;
  userId: string;
  userName: string;
  businessName: string | null;
  
  // Provider Details
  providerType: ProviderType;
  verificationStatus: ProviderVerificationStatus;
  
  // Status
  status: AdminProviderStatus;
  
  // Stats
  serviceCount: number;
  bookingCount: number;
  completedBookings: number;
  rating: number;
  reviewCount: number;
  reportCount: number;
  
  // Financial
  totalEarnings: number;
  pendingPayouts: number;
  
  // Verification
  documentsSubmitted: boolean;
  businessVerified: boolean;
  backgroundCheckPassed: boolean;
  
  // Categories
  serviceCategories: string[];
  
  // Moderation
  warningCount: number;
  suspensionCount: number;
  
  // Timestamps
  joinedAt: string;
  lastActiveAt: string | null;
  verifiedAt: string | null;
}

/**
 * Provider Type
 */
export enum ProviderType {
  Individual = 0,
  Business = 1,
  Company = 2,
  Freelancer = 3
}

/**
 * Provider Verification Status
 */
export enum ProviderVerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3,
  Suspended = 4
}

/**
 * Admin Provider Status
 */
export enum AdminProviderStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Banned = 3,
  UnderReview = 4
}

/**
 * Admin Service Booking
 */
export interface AdminServiceBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceTitle: string;
  
  // Booking Details
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  price: number;
  currency: string;
  
  // Status
  status: AdminBookingStatus;
  paymentStatus: PaymentStatus;
  
  // Location
  serviceLocation: string | null;
  isRemote: boolean;
  
  // Communication
  customerNotes: string | null;
  providerNotes: string | null;
  
  // Completion
  completedAt: string | null;
  customerRating: number | null;
  providerRating: number | null;
  
  // Timestamps
  bookedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  
  // Disputes
  hasDispute: boolean;
  disputeReason: string | null;
}

/**
 * Admin Booking Status
 */
export enum AdminBookingStatus {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  NoShow = 5,
  Disputed = 6,
  Refunded = 7
}

/**
 * Admin Service Review
 */
export interface AdminServiceReview {
  id: string;
  serviceId: string;
  serviceTitle: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  
  // Review Details
  rating: number;
  comment: string | null;
  
  // Status
  status: AdminReviewStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  helpfulCount: number;
  reportCount: number;
  
  // Media
  imageUrls: string[];
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Review Status
 */
export enum AdminReviewStatus {
  Published = 0,
  Hidden = 1,
  Flagged = 2,
  Deleted = 3,
  Pending = 4
}

/**
 * Services Filter
 */
export interface ServicesFilter {
  search: string | null;
  contentType: ServicesContentType | null;
  status: AdminServiceStatus | null;
  moderationStatus: ModerationStatus | null;
  providerId: string | null;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
  isRemote: boolean | null;
}

/**
 * Services Content Type
 */
export enum ServicesContentType {
  Service = 0,
  Provider = 1,
  Booking = 2,
  Review = 3
}

/**
 * Services Statistics
 */
export interface ServicesStatistics {
  totalServices: number;
  totalProviders: number;
  totalBookings: number;
  totalReviews: number;
  
  // Status Breakdown
  activeServices: number;
  completedBookings: number;
  flaggedServices: number;
  
  // Financial
  totalRevenue: number;
  averageBookingValue: number;
  totalTransactions: number;
  
  // Moderation
  pendingModeration: number;
  reportedItems: number;
  
  // Growth
  newServicesToday: number;
  newServicesThisWeek: number;
  newServicesThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
  
  // Top Providers
  topProviders: ProviderStats[];
}

/**
 * Provider Stats
 */
export interface ProviderStats {
  providerId: string;
  providerName: string;
  serviceCount: number;
  bookingCount: number;
  rating: number;
  revenue: number;
}